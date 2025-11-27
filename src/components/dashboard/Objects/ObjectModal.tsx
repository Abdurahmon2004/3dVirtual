import { useEffect, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/features/objectSlice";
import { RootState } from "@/store";
import { useGetCompaniesInfinite } from "@/hooks/modules/companies";
import { useDistricts, useRegions } from "@/hooks/modules/region";
import { useCrateObject, useUpdateObject } from "@/hooks/modules/object";
const objectSchema = z
    .object({
        company_id: z
            .union([
                z.string().regex(/^\d+$/, "Kompaniya ID raqam bo‘lishi kerak"),
                z.number(),
            ])
            .transform((val) => Number(val))
            .refine((val) => val > 0, "Kompaniya ID kiritilishi shart"),
        name: z.string().min(1, "Obyekt nomi kiritilishi shart").max(190),
        region_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
        district_id: z.union([z.string(), z.number()]).transform((val) => Number(val)),
        address: z.string().min(1, "Manzil kiritilishi shart").max(255),
        start_date: z.string().refine(
            (val) => !isNaN(Date.parse(val)),
            "Boshlanish sana noto‘g‘ri formatda"
        ),
        end_date: z.string().refine(
            (val) => !isNaN(Date.parse(val)),
            "Tugash sana noto‘g‘ri formatda"
        ),
        description: z.string().optional(),
        is_active: z.boolean().optional(),
        cover_path: z
            .any()
            .optional()
            .refine(
                (file) => !file || file instanceof File,
                "Fayl noto‘g‘ri tipda"
            )
            .refine(
                (file) =>
                    !file ||
                    ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                        file.type
                    ),
                "Faqat jpg, jpeg, png yoki webp ruxsat etiladi"
            )
            .refine(
                (file) => !file || file.size / 1024 <= 5120,
                "Fayl hajmi 5MB dan oshmasin"
            ),
    })
    .refine(
        (data) => new Date(data.end_date) >= new Date(data.start_date),
        {
            message: "Tugash sana boshlanish sanasidan keyin yoki teng bo‘lishi kerak",
            path: ["end_date"],
        }
    );

export default function ObjectModal() {
    const dispatch = useDispatch();
    const { open, editing } = useSelector((state: RootState) => state.object);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(objectSchema),
        defaultValues: {
            company_id: "",
            name: "",
            region_id: "",
            district_id: "",
            address: "",
            start_date: "",
            end_date: "",
            description: "",
            is_active: true,
            cover_path: null,
        },
    });
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useGetCompaniesInfinite();
    const companies = data?.pages.flatMap((page) => page.data) ?? [];

    const { data: regionsData, isLoading: isLoadingRegions } = useRegions();
    const selectedRegionId = watch("region_id");
    const { data: districtsData, isLoading: isLoadingDistricts } = useDistricts(
        Number(selectedRegionId)
    );
    useEffect(() => {
        if (editing) {
            reset({
                ...editing,
                company_id: editing.company_id || "",
                region_id: editing.region_id?.toString() || "",
                district_id: editing.district_id?.toString() || "",
                start_date: editing.start_date?.slice(0, 10) || "",
                end_date: editing.end_date?.slice(0, 10) || "",
                cover_path: null,
            });
        } else {
            reset();
        }
    }, [editing, reset]);
    const listboxRef = useRef<HTMLUListElement | null>(null);

    const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
        const listboxNode = event.currentTarget;
        if (
            listboxNode.scrollTop + listboxNode.clientHeight >=
            listboxNode.scrollHeight - 20
        ) {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };
    const { mutate: createObject } = useCrateObject();
    const { mutate: updateObject } = useUpdateObject();
    const handleFormSubmit = (values: any) => {
        values.is_active = Number(values.is_active);

        const payload = {
            ...values,
            company_id: Number(values.company_id),
            region_id: Number(values.region_id),
            district_id: Number(values.district_id),
        };

        const onSuccess = () => {
            reset({
                company_id: "",
                name: "",
                region_id: "",
                district_id: "",
                address: "",
                start_date: "",
                end_date: "",
                description: "",
                is_active: true,
                cover_path: null,
            });
            dispatch(closeModal());
        };

        if (editing) {
            updateObject({ object_id: editing.id, ...payload }, { onSuccess });
        } else {
            createObject(payload, { onSuccess });
        }
    };


    const handleClose = () => {
        reset({
            company_id: "",
            name: "",
            region_id: "",
            district_id: "",
            address: "",
            start_date: "",
            end_date: "",
            description: "",
            is_active: true,
            cover_path: null,
        });
        dispatch(closeModal());
    };


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                {editing ? "Obyektni tahrirlash" : "Yangi obyekt yaratish"}
            </DialogTitle>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Autocomplete
                            size="small"
                            fullWidth
                            loading={isLoading}
                            options={companies}
                            getOptionLabel={(option) => option.name || ""}
                            onChange={(_, value) =>
                                setValue("company_id", value?.id || "")
                            }
                            value={
                                companies.find(
                                    (c) => Number(c.id) === Number(watch("company_id"))
                                ) || null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Kompaniya tanlang"
                                    error={!!errors.company_id}
                                    helperText={errors.company_id?.message}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoading ? <CircularProgress size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            ListboxProps={{
                                ref: listboxRef,
                                onScroll: handleScroll,
                                style: { maxHeight: 200, overflow: "auto" },
                            }}
                            noOptionsText="Kompaniyalar topilmadi"
                        />
                        <TextField
                            label="Obyekt nomi"
                            size="small"
                            fullWidth
                            {...register("name")}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        <Autocomplete
                            size="small"
                            fullWidth
                            loading={isLoadingRegions}
                            options={regionsData || []}
                            getOptionLabel={(option) => option.name || ""}
                            onChange={(_, value) => {
                                setValue("region_id", value?.id?.toString() || "");
                                setValue("district_id", "");
                            }}
                            value={
                                regionsData?.find(
                                    (r: any) =>
                                        Number(r.id) === Number(watch("region_id"))
                                ) || null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Viloyat tanlang"
                                    error={!!errors.region_id}
                                    helperText={errors.region_id?.message}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoadingRegions ? (
                                                    <CircularProgress size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            noOptionsText="Viloyatlar topilmadi"
                        />
                        <Autocomplete
                            size="small"
                            fullWidth
                            loading={isLoadingDistricts}
                            options={districtsData || []}
                            getOptionLabel={(option) => option.name || ""}
                            onChange={(_, value) =>
                                setValue("district_id", value?.id?.toString() || "")
                            }
                            value={
                                districtsData?.find(
                                    (d: any) =>
                                        Number(d.id) === Number(watch("district_id"))
                                ) || null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tuman/Shahar tanlang"
                                    error={!!errors.district_id}
                                    helperText={errors.district_id?.message}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoadingDistricts ? (
                                                    <CircularProgress size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            noOptionsText={
                                selectedRegionId
                                    ? "Tuman/Shahar topilmadi"
                                    : "Avval viloyat tanlang"
                            }
                            disabled={!selectedRegionId}
                        />
                        <TextField
                            label="Manzil"
                            size="small"
                            fullWidth
                            {...register("address")}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                        <TextField
                            label="Boshlanish sana"
                            type="date"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            {...register("start_date")}
                            error={!!errors.start_date}
                            helperText={errors.start_date?.message}
                        />
                        <TextField
                            label="Tugash sana"
                            type="date"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            {...register("end_date")}
                            error={!!errors.end_date}
                            helperText={errors.end_date?.message}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...register("is_active")}
                                    checked={watch("is_active")}
                                />
                            }
                            label="Faol holatda"
                        />

                        <div className="col-span-3">
                            <TextField
                                label="Izoh (ixtiyoriy)"
                                size="small"
                                fullWidth
                                multiline
                                rows={2}
                                {...register("description")}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </div>

                        <div className="col-span-3">
                            <TextField
                                type="file"
                                size="small"
                                fullWidth
                                inputProps={{ accept: "image/*" }}
                                onChange={(e) => {
                                    //@ts-ignore
                                    const file = e.target.files?.[0];
                                    if (file) setValue("cover_path", file);
                                }}
                                error={!!errors.cover_path}
                                helperText={
                                    errors.cover_path?.message as string | undefined
                                }
                            />
                        </div>
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
