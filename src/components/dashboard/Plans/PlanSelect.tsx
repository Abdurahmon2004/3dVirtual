import { useGetPlansInfinite } from "@/hooks/modules/plan";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";

export const PlanSelect = ({ value, onChange, block_id }: any) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPlansInfinite({ block_id });

  const loadRef = useRef<HTMLDivElement | null>(null);

  const plans = useMemo(() => {
    return data?.pages?.flatMap((p: any) => p.data) || [];
  }, [data]);

  useEffect(() => {
    if (!loadRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
    });
    obs.observe(loadRef.current);
    return () => obs.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <Autocomplete
      fullWidth
      value={plans.find((p) => p.id === value) || null}
      onChange={(_, v) => onChange(v ? v.id : null)}
      options={plans}
      getOptionLabel={(opt) => opt?.name || ""}
      loading={isFetchingNextPage}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Plan tanlang"
          margin="dense"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetchingNextPage && <CircularProgress size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option, { index }) => {
        const isLast = index === plans.length - 1;

        return (
          <>
            <li {...props}>{option.name}</li>
            {isLast && <div ref={loadRef} style={{ height: 1 }} />}
          </>
        );
      }}
    />
  );
};
