import type {
  ManagedService,
  ServiceHighlight,
  ServiceHighlightForm,
  ServiceHighlightsResponse,
  ServicesResponse,
} from "~/types/service";

const emptyHighlightForm = (): ServiceHighlightForm => ({
  serviceId: "",
  title: "",
  description: "",
  imageUrl: "",
  isActive: true,
  startsAt: "",
  endsAt: "",
});

const getErrorMessage = (error: unknown, fallback: string) => {
  const requestError = error as {
    data?: { message?: string; statusMessage?: string };
    message?: string;
  };
  return (
    requestError.data?.message ||
    requestError.data?.statusMessage ||
    requestError.message ||
    fallback
  );
};

const toApiDate = (value: string) =>
  value ? new Date(value).toISOString() : null;

export const useServiceHighlights = () => {
  const $q = useQuasar();
  const highlights = ref<ServiceHighlight[]>([]);
  const candidateServices = ref<ManagedService[]>([]);
  const maxHighlights = ref(5);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const deletingId = ref<string | null>(null);

  const loadHighlights = async () => {
    isLoading.value = true;
    try {
      const [highlightResponse, serviceResponse] = await Promise.all([
        $fetch<ServiceHighlightsResponse>("/api/services/highlights"),
        $fetch<ServicesResponse>("/api/services", {
          query: {
            page: 1,
            pageSize: 100,
            status: "active",
            sortBy: "position",
            sortOrder: "asc",
          },
        }),
      ]);
      highlights.value = highlightResponse.highlights;
      maxHighlights.value = highlightResponse.maxHighlights;
      candidateServices.value = serviceResponse.services;
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(
          error,
          "Não foi possível carregar os destaques",
        ),
      });
    } finally {
      isLoading.value = false;
    }
  };

  const createForm = (highlight?: ServiceHighlight | null) => {
    if (!highlight) return emptyHighlightForm();
    const toLocalDate = (value: string | null) =>
      value ? new Date(value).toISOString().slice(0, 16) : "";
    return {
      serviceId: highlight.serviceId,
      title: highlight.title,
      description: highlight.description ?? "",
      imageUrl: highlight.imageUrl ?? "",
      isActive: highlight.isActive,
      startsAt: toLocalDate(highlight.startsAt),
      endsAt: toLocalDate(highlight.endsAt),
    };
  };

  const saveHighlight = async (
    form: ServiceHighlightForm,
    highlightId: string | null,
  ) => {
    isSaving.value = true;
    try {
      const body = {
        serviceId: form.serviceId,
        title: form.title,
        description: form.description.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        isActive: form.isActive,
        startsAt: toApiDate(form.startsAt),
        endsAt: toApiDate(form.endsAt),
      };
      if (highlightId) {
        await $fetch(`/api/services/highlights/${highlightId}`, {
          method: "PATCH",
          body,
        });
      } else {
        await $fetch("/api/services/highlights", {
          method: "POST",
          body,
        });
      }
      await loadHighlights();
      $q.notify({
        type: "positive",
        message: highlightId ? "Destaque atualizado" : "Destaque adicionado",
      });
      return true;
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível salvar o destaque"),
      });
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  const reorderHighlights = async (ordered: ServiceHighlight[]) => {
    highlights.value = ordered.map((highlight, position) => ({
      ...highlight,
      position,
    }));
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
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(
          error,
          "Não foi possível reordenar os destaques",
        ),
      });
      await loadHighlights();
    }
  };

  const deleteHighlight = async (highlight: ServiceHighlight) => {
    deletingId.value = highlight.id;
    try {
      await $fetch(`/api/services/highlights/${highlight.id}`, {
        method: "DELETE",
      });
      highlights.value = highlights.value.filter(
        (item) => item.id !== highlight.id,
      );
      $q.notify({ type: "positive", message: "Destaque removido" });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: getErrorMessage(error, "Não foi possível remover o destaque"),
      });
    } finally {
      deletingId.value = null;
    }
  };

  return {
    highlights,
    candidateServices,
    maxHighlights,
    isLoading,
    isSaving,
    deletingId,
    loadHighlights,
    createForm,
    saveHighlight,
    reorderHighlights,
    deleteHighlight,
  };
};
