import type {
  ManagedService,
  ServiceFilters,
  ServiceForm,
  ServiceIllustration,
  ServicesResponse,
} from "~/types/service";

type ApiError = {
  data?: {
    message?: string;
    statusMessage?: string;
  };
  message?: string;
  statusMessage?: string;
};

type UploadResponse = {
  url: string;
};

export const normalizeServiceSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

export const createEmptyServiceForm = (): ServiceForm => ({
  name: "",
  slug: "",
  description: "",
  imageUrl: null,
  imageFile: null,
  illustrationId: null,
  durationMinutes: 30,
  price: null,
  isActive: true,
  position: null,
});

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError;
  return (
    apiError.data?.message ||
    apiError.data?.statusMessage ||
    apiError.message ||
    apiError.statusMessage ||
    fallback
  );
};

const getServiceEndpoint = (id: string) =>
  `/api/services/${encodeURIComponent(id)}` as "/api/services/:id";

export const useServices = () => {
  const $q = useQuasar();
  const services = ref<ManagedService[]>([]);
  const illustrations = ref<ServiceIllustration[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const isReordering = ref(false);
  const deletingId = ref<string | null>(null);

  const filters = ref<ServiceFilters>({
    page: 1,
    pageSize: 10,
    search: "",
    status: "all",
    sortBy: "position",
    sortOrder: "asc",
  });

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const summary = reactive<ServicesResponse["summary"]>({
    activeCount: 0,
    totalCount: 0,
    maxServices: null,
    plan: null,
  });

  const hasReachedLimit = computed(
    () =>
      summary.maxServices !== null &&
      summary.totalCount >= summary.maxServices,
  );

  const loadServices = async (append = false) => {
    isLoading.value = true;
    try {
      const response = await $fetch<ServicesResponse>("/api/services", {
        query: {
          page: filters.value.page,
          pageSize: filters.value.pageSize,
          search: filters.value.search || undefined,
          status: filters.value.status,
          sortBy: filters.value.sortBy,
          sortOrder: filters.value.sortOrder,
        },
      });

      services.value = append
        ? [
            ...services.value,
            ...response.services.filter(
              (service) =>
                !services.value.some((current) => current.id === service.id),
            ),
          ]
        : response.services;
      Object.assign(pagination, response.pagination);
      Object.assign(summary, response.summary);
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível carregar os serviços"),
      });
    } finally {
      isLoading.value = false;
    }
  };

  const loadIllustrations = async () => {
    try {
      const response = await $fetch<{
        illustrations: ServiceIllustration[];
      }>("/api/services/illustrations");
      illustrations.value = response.illustrations;
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(
          error,
          "Não foi possível carregar as imagens automáticas",
        ),
      });
    }
  };

  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const response = await $fetch<UploadResponse>("/api/uploads/images", {
      method: "POST",
      query: { scope: "service-image" },
      body,
    });
    return response.url;
  };

  const saveService = async (
    form: ServiceForm,
    serviceId: string | null,
  ) => {
    isSaving.value = true;
    try {
      const imageUrl = form.imageFile
        ? await uploadImage(form.imageFile)
        : form.imageUrl;
      const payload = {
        name: form.name.trim(),
        slug: normalizeServiceSlug(form.slug || form.name),
        description: form.description.trim() || null,
        imageUrl,
        illustrationId: imageUrl ? null : form.illustrationId,
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
        isActive: form.isActive,
        ...(form.position === null ? {} : { position: form.position }),
      };

      if (serviceId) {
        await $fetch(getServiceEndpoint(serviceId), {
          method: "PATCH",
          body: payload,
        });
      } else {
        await $fetch("/api/services", {
          method: "POST",
          body: payload,
        });
      }

      $q.notify({
        type: "positive",
        message: serviceId
          ? "Serviço atualizado com sucesso"
          : "Serviço criado com sucesso",
      });
      await loadServices();
      return true;
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível salvar o serviço"),
      });
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  const deleteService = async (service: ManagedService) => {
    deletingId.value = service.id;
    try {
      await $fetch(getServiceEndpoint(service.id), { method: "DELETE" });
      $q.notify({
        type: "positive",
        message: "Serviço excluído com sucesso",
      });

      if (services.value.length === 1 && filters.value.page > 1) {
        filters.value.page -= 1;
      }
      await loadServices();
      return true;
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível excluir o serviço"),
      });
      return false;
    } finally {
      deletingId.value = null;
    }
  };

  const toggleService = async (service: ManagedService) => {
    try {
      await $fetch(getServiceEndpoint(service.id), {
        method: "PATCH",
        body: { isActive: !service.isActive },
      });
      $q.notify({
        type: "positive",
        message: service.isActive
          ? "Serviço desativado"
          : "Serviço ativado",
      });
      await loadServices();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível alterar o serviço"),
      });
    }
  };

  const reorderServices = async (orderedServices: ManagedService[]) => {
    const availablePositions = orderedServices
      .map((service) => service.position)
      .sort((first, second) => first - second);
    const items = orderedServices.map((service, index) => ({
      id: service.id,
      position: availablePositions[index] ?? index,
    }));

    services.value = orderedServices.map((service, index) => ({
      ...service,
      position: items[index]?.position ?? index,
    }));

    isReordering.value = true;
    try {
      await $fetch("/api/services/reorder", {
        method: "PATCH",
        body: { items },
      });
      $q.notify({
        type: "positive",
        message: "Ordem dos serviços atualizada",
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(
          error,
          "Não foi possível atualizar a ordem dos serviços",
        ),
      });
      await loadServices();
    } finally {
      isReordering.value = false;
    }
  };

  return {
    services,
    illustrations,
    filters,
    pagination,
    summary,
    hasReachedLimit,
    isLoading,
    isSaving,
    isReordering,
    deletingId,
    loadServices,
    loadIllustrations,
    saveService,
    deleteService,
    toggleService,
    reorderServices,
  };
};
