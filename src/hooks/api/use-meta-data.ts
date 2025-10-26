import { wasApi } from "@/apis/fetcher";
import { METADATAS_TAG } from "@/constants/revalidate-tag";
import { TMetadata } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useMetaData = () =>
  useQuery({
    queryKey: [METADATAS_TAG],
    queryFn: () =>
      wasApi
        .get<{ data: TMetadata }>("v1/metadata")
        .then((res) => res.data.data),
    gcTime: Infinity,
  });
