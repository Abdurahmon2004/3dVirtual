import React, { useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetObjectsInfinite } from "@/hooks/modules/object";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { closeModal } from "@/store/features/blockSlice";
import { useCrateBlock, useUpdateBlock } from "@/hooks/modules/block";

const blockPayloadSchema = z.object({
    object_id: z
        .union([
            z.string().regex(/^\d+$/, "Obyekt ID raqam bo‘lishi kerak"),
            z.number(),
        ])
        .transform((v) => Number(v))
        .refine((v) => v > 0, "Obyekt tanlanishi shart"),
    name: z.string().max(190, "Nomi 190 belgidan oshmasligi kerak").or(z.literal("")).transform(v => v === "" ? undefined : v),
    is_active: z.boolean().optional(),
});

type BlockPayload = z.infer<typeof blockPayloadSchema>;
export default function BlockModal() {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BlockPayload>({
        //@ts-ignore
        resolver: zodResolver(blockPayloadSchema),
        defaultValues: {
            object_id: "" as any,
            name: undefined,
            is_active: true,
        },
    });
    const dispatch = useDispatch();
    const { open, editing } = useSelector((store: RootState) => store.block)
    const {
        data: objectsPages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingObjects,
    } = useGetObjectsInfinite();
    const objects = objectsPages?.pages.flatMap((p: any) => p.data) ?? [];
    const listboxRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (editing) {
            reset({
                object_id: editing.object_id?.toString() as any || "",
                name: editing.name ?? undefined,
                is_active: editing.is_active ?? true,
            });
        } else {
            reset({
                object_id: "" as any,
                name: undefined,
                is_active: true,
            });
        }
    }, [editing, reset,open]);

    const handleListboxScroll = (event: React.UIEvent<HTMLUListElement>) => {
        const node = event.currentTarget;
        if (node.scrollTop + node.clientHeight >= node.scrollHeight - 20) {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };
    const { mutate: createBlock } = useCrateBlock();
    const { mutate: updateBlock } = useUpdateBlock();
    const handleSubmitBlock = (values: any) => {
        const parsed = blockPayloadSchema.parse(values);

        const onSuccess = () => {
            reset({
                object_id: "" as any,
                name: undefined,
                is_active: true,
            });
            dispatch(closeModal());
        };

        if (editing) {
            updateBlock({ block_id: editing.id, ...parsed }, { onSuccess });
        } else {
            createBlock(parsed, { onSuccess });
        }
    };

    const handleClose = () => {
        dispatch(closeModal())
    }
    return (
        <Dialog open={open} onClose={() => dispatch(closeModal())} fullWidth maxWidth="sm">
            <DialogTitle>{editing ? "Blokni tahrirlash" : "Yangi blok"}</DialogTitle>

            <form onSubmit={handleSubmit(handleSubmitBlock)}>
                <DialogContent>
                    <div className="grid grid-cols-1 gap-4">
                        <Autocomplete
                            size="small"
                            fullWidth
                            loading={isLoadingObjects}
                            options={objects}
                            getOptionLabel={(opt: any) => opt.name ?? String(opt.id)}
                            onChange={(_, value) => setValue("object_id", value?.id ?? "")}
                            value={
                                objects.find((o: any) => Number(o.id) === Number(watch("object_id"))) || null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Obyekt tanlang"
                                    error={!!errors.object_id}
                                    helperText={errors.object_id?.message}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoadingObjects ? <CircularProgress size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            ListboxProps={{
                                ref: listboxRef,
                                onScroll: handleListboxScroll,
                                style: { maxHeight: 220, overflow: "auto" },
                            }}
                            noOptionsText="Obyektlar topilmadi"
                        />
                        <TextField
                            label="Nomi"
                            size="small"
                            fullWidth
                            {...register("name")}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        <FormControlLabel
                            control={<Checkbox {...register("is_active")} checked={!!watch("is_active")} />}
                            label="Faol holatda"
                        />
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="inherit">
                        Bekor qilish
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {editing ? "Saqlash" : "Yaratish"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
