import type {
  ManagedService,
  ServiceFilters,
  ServiceForm,
  ServiceHighlight,
  ServiceHighlightForm,
  ServiceHighlightsResponse,
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

export const createEmptyHighlightForm = (): ServiceHighlightForm => ({
  enabled: false,
  id: null,
  title: "",
  description: "",
  imageUrl: null,
  imageFile: null,
  isActive: true,
  startsAt: "",
  endsAt: "",
  position: null,
});

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
  highlight: createEmptyHighlightForm(),
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

const toApiDate = (value: string) =>
  value ? new Date(value).toISOString() : null;

const toLocalDate = (value: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export const useServices = () => {
  const $q = useQuasar();
  const services = ref<ManagedService[]>([]);
  const highlights = ref<ServiceHighlight[]>([]);
  const illustrations = ref<ServiceIllustration[]>([]);
  const isLoading = ref(false);
  const isLoadingHighlights = ref(false);
  const isSaving = ref(false);
  const isReordering = ref(false);
  const isReorderingHighlights = ref(false);
  const deletingId = ref<string | null>(null);
  const removingHighlightId = ref<string | null>(null);

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
    highlightsCount: 0,
    maxHighlights: 5,
  });

  const hasReachedLimit = computed(
    () =>
      summary.maxServices !== null &&
      summary.totalCount >= summary.maxServices,
  );

  const hasReachedHighlightLimit = computed(
    () => summary.highlightsCount >= summary.maxHighlights,
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

  const loadHighlights = async () => {
    isLoadingHighlights.value = true;
    try {
      const response = await $fetch<ServiceHighlightsResponse>(
        "/api/services/highlights",
      );
      highlights.value = response.highlights;
      summary.highlightsCount = response.highlights.length;
      summary.maxHighlights = response.maxHighlights;
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível carregar os destaques"),
      });
    } finally {
      isLoadingHighlights.value = false;
    }
  };

  const fetchServiceById = async (id: string) =>
    await $fetch<ManagedService>(getServiceEndpoint(id));

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

  const saveHighlight = async (
    serviceId: string,
    servicePayload: {
      name: string;
      description: string | null;
      imageUrl: string | null;
      illustrationImageUrl?: string | null;
    },
    highlight: ServiceHighlightForm,
  ) => {
    if (!highlight.enabled) {
      if (highlight.id) {
        await $fetch(`/api/services/highlights/${highlight.id}`, {
          method: "DELETE",
        });
      }
      return;
    }

    const highlightImageUrl = highlight.imageFile
      ? await uploadImage(highlight.imageFile)
      : highlight.imageUrl;

    const fallbackImage =
      servicePayload.imageUrl || servicePayload.illustrationImageUrl || null;

    const body = {
      serviceId,
      title: highlight.title.trim() || servicePayload.name,
      description:
        highlight.description.trim() || servicePayload.description || null,
      imageUrl: highlightImageUrl || fallbackImage || null,
      isActive: highlight.isActive,
      startsAt: toApiDate(highlight.startsAt),
      endsAt: toApiDate(highlight.endsAt),
      ...(highlight.position === null ? {} : { position: highlight.position }),
    };

    if (highlight.id) {
      await $fetch(`/api/services/highlights/${highlight.id}`, {
        method: "PATCH",
        body,
      });
      return;
    }

    await $fetch("/api/services/highlights", {
      method: "POST",
      body,
    });
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

      let savedServiceId = serviceId;

      if (serviceId) {
        await $fetch(getServiceEndpoint(serviceId), {
          method: "PATCH",
          body: payload,
        });
      } else {
        const created = await $fetch<{ service: ManagedService }>("/api/services", {
          method: "POST",
          body: payload,
        });
        savedServiceId = created.service.id;
      }

      if (savedServiceId) {
        const illustration = illustrations.value.find(
          (item) => item.id === form.illustrationId,
        );
        await saveHighlight(
          savedServiceId,
          {
            name: payload.name,
            description: payload.description,
            imageUrl: payload.imageUrl,
            illustrationImageUrl: illustration?.imageUrl ?? null,
          },
          form.highlight,
        );
      }

      $q.notify({
        type: "positive",
        message: serviceId
          ? "Serviço atualizado com sucesso"
          : "Serviço criado com sucesso",
      });
      await Promise.all([loadServices(), loadHighlights()]);
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
      await Promise.all([loadServices(), loadHighlights()]);
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
      await Promise.all([loadServices(), loadHighlights()]);
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível alterar o serviço"),
      });
    }
  };

  const reorderHighlights = async (ordered: ServiceHighlight[]) => {
    highlights.value = ordered.map((highlight, position) => ({
      ...highlight,
      position,
    }));

    isReorderingHighlights.value = true;
    try {
      await $fetch("/api/services/highlights/reorder", {
        method: "PATCH",
        body: {
          items: highlights.value.map((highlight) => ({
            id: highlight.id,
            position: highlight.position,
          })),
        },
      });
      $q.notify({
        type: "positive",
        message: "Ordem dos destaques atualizada",
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(
          error,
          "Não foi possível reordenar os destaques",
        ),
      });
      await loadHighlights();
    } finally {
      isReorderingHighlights.value = false;
    }
  };

  const removeHighlight = async (highlight: ServiceHighlight) => {
    removingHighlightId.value = highlight.id;
    try {
      await $fetch(`/api/services/highlights/${highlight.id}`, {
        method: "DELETE",
      });
      $q.notify({ type: "positive", message: "Destaque removido" });
      await Promise.all([loadServices(), loadHighlights()]);
      return true;
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível remover o destaque"),
      });
      return false;
    } finally {
      removingHighlightId.value = null;
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

  const buildServiceForm = (
    service?: ManagedService | null,
    options?: { enableHighlight?: boolean },
  ): ServiceForm => {
    if (!service) {
      const form = createEmptyServiceForm();
      if (options?.enableHighlight) form.highlight.enabled = true;
      return form;
    }

    const highlight = service.highlight;
    return {
      name: service.name,
      slug: service.slug,
      description: service.description || "",
      imageUrl: service.imageUrl,
      imageFile: null,
      illustrationId: service.illustrationId,
      durationMinutes: service.durationMinutes,
      price: service.price,
      isActive: service.isActive,
      position: service.position,
      highlight: {
        enabled: Boolean(highlight) || Boolean(options?.enableHighlight),
        id: highlight?.id ?? null,
        title: highlight?.title ?? "",
        description: highlight?.description ?? "",
        imageUrl: highlight?.imageUrl ?? null,
        imageFile: null,
        isActive: highlight?.isActive ?? true,
        startsAt: toLocalDate(highlight?.startsAt ?? null),
        endsAt: toLocalDate(highlight?.endsAt ?? null),
        position: highlight?.position ?? null,
      },
    };
  };

  return {
    services,
    highlights,
    illustrations,
    filters,
    pagination,
    summary,
    hasReachedLimit,
    hasReachedHighlightLimit,
    isLoading,
    isLoadingHighlights,
    isSaving,
    isReordering,
    isReorderingHighlights,
    deletingId,
    removingHighlightId,
    loadServices,
    loadHighlights,
    loadIllustrations,
    fetchServiceById,
    saveService,
    deleteService,
    toggleService,
    reorderServices,
    reorderHighlights,
    removeHighlight,
    buildServiceForm,
  };
};
