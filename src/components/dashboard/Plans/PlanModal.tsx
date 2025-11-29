import React, { useEffect, useRef, useState, useMemo } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Autocomplete,
    CircularProgress,
    FormHelperText,
    useTheme,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { closeModal } from "@/store/features/blockSlice";
import { useGetCompaniesInfinite } from "@/hooks/modules/companies";
import { useCratePlan, useUpdatePlan } from "@/hooks/modules/plan";
import { buildStorageUrl } from "@/constants/urls";

const MAX_IMAGE_SIZE_KB = 5120;
const MAX_DOCUMENT_SIZE_KB = 10240;
type UploadValue = File | undefined | null | string;

const isFileValue = (value: unknown): value is File =>
    typeof File !== "undefined" && value instanceof File;

const createFileSchema = (maxKilobytes: number, fieldLabel: string) =>
    z
        .custom<UploadValue>()
        .optional()
        .refine(
            (file) =>
                file === undefined ||
                file === null ||
                typeof file === "string" ||
                (isFileValue(file) && file.size <= maxKilobytes * 1024),
            `${fieldLabel} hajmi ${maxKilobytes} KB dan oshmasligi kerak`
        );

type FileFieldName = "image_one" | "image_two" | "document";

const blockPayloadSchema = z.object({
    company_id: z
        .union([
            z.string().regex(/^\d+$/, "Obyekt ID raqam bo‘lishi kerak"),
            z.number(),
        ])
        .transform((v) => Number(v))
        .refine((v) => v > 0, "Obyekt tanlanishi shart"),
    name: z.string().max(190, "Nomi 190 belgidan oshmasligi kerak").or(z.literal("")).transform(v => v === "" ? undefined : v),
    image_one: createFileSchema(MAX_IMAGE_SIZE_KB, "1-rasm"),
    image_two: createFileSchema(MAX_IMAGE_SIZE_KB, "2-rasm"),
    document: createFileSchema(MAX_DOCUMENT_SIZE_KB, "3D rasm"),
});

type BlockPayload = z.infer<typeof blockPayloadSchema>;
export default function PlanModal() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const surfaceColor = isDarkMode ? "#1f2937" : "#ffffff";
    const contentColor = isDarkMode ? "#111827" : "#f8fafc";
    const primaryText = isDarkMode ? "#f8fafc" : "#0f172a";
    const secondaryText = isDarkMode ? "rgba(226,232,240,0.8)" : "#475569";
    const dividerColor = "rgba(248,250,252,0.08)";
    const cardBorder = isDarkMode ? "rgba(148,163,184,0.35)" : "rgba(99,102,241,0.25)";
    const cardBg = isDarkMode ? "rgba(15,23,42,0.7)" : "#ffffff";
    const helperTextColor = isDarkMode ? "rgba(226,232,240,0.85)" : "#475569";
    const filePlaceholderColor = isDarkMode ? "#e2e8f0" : "#1e293b";
    const fileSubTextColor = isDarkMode ? "#94a3b8" : "#64748b";

    const textFieldStyles = useMemo(
        () => ({
            "& .MuiInputBase-root": {
                backgroundColor: isDarkMode ? "rgba(15,23,42,0.45)" : "rgba(148,163,184,0.12)",
                borderRadius: 14,
                border: `1px solid ${isDarkMode ? "rgba(226,232,240,0.25)" : "rgba(148,163,184,0.3)"}`,
                color: primaryText,
                paddingLeft: "6px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
            },
            "& .MuiInputLabel-root": {
                color: isDarkMode ? "rgba(248,250,252,0.7)" : "#1e293b",
                fontWeight: 600,
                fontSize: 14,
            },
            "& .MuiInputLabel-root.Mui-focused": {
                color: primaryText,
            },
            "& .MuiInputBase-input": {
                color: primaryText,
                fontSize: 14,
            },
            "& .MuiFormHelperText-root": {
                color: secondaryText,
            },
        }),
        [isDarkMode, primaryText, secondaryText]
    );

    const [previews, setPreviews] = useState<Record<FileFieldName, string | null>>({
        image_one: null,
        image_two: null,
        document: null,
    });
    const fileInputRefs = useRef<Record<FileFieldName, HTMLInputElement | null>>({
        image_one: null,
        image_two: null,
        document: null,
    });
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<BlockPayload>({
        //@ts-ignore
        resolver: zodResolver(blockPayloadSchema),
        defaultValues: {
            company_id: "" as any,
            name: undefined,
            image_one: undefined,
            image_two: undefined,
            document: undefined,
        },
    });
    const dispatch = useDispatch();
    const { open, editing } = useSelector((store: RootState) => store.plan)
    const listboxRef = useRef<HTMLUListElement | null>(null);

    const resolveEditingPreview = (key: FileFieldName) => {
        if (!editing) return null;
        // Avval editing[key] ni tekshirish - agar obyekt bo'lsa, uning ichidagi url yoki path ni olish
        const imageObj = editing?.[key];
        if (imageObj && typeof imageObj === "object" && !Array.isArray(imageObj)) {
            // Obyekt ichidagi url yoki path ni tekshirish
            if (imageObj.url && typeof imageObj.url === "string" && imageObj.url.length > 0) {
                if (imageObj.url.startsWith("http://") || imageObj.url.startsWith("https://")) {
                    return imageObj.url;
                }
                const cleanPath = imageObj.url.startsWith("/") ? imageObj.url : `/${imageObj.url}`;
                return buildStorageUrl(cleanPath);
            }
            if (imageObj.path && typeof imageObj.path === "string" && imageObj.path.length > 0) {
                const cleanPath = imageObj.path.startsWith("/") ? imageObj.path : `/${imageObj.path}`;
                return buildStorageUrl(cleanPath);
            }
        }
        
        // Agar editing[key] string bo'lsa
        if (typeof imageObj === "string" && imageObj.length > 0 && imageObj !== "null" && imageObj !== "undefined") {
            if (imageObj.startsWith("http://") || imageObj.startsWith("https://")) {
                return imageObj;
            }
            const cleanPath = imageObj.startsWith("/") ? imageObj : `/${imageObj}`;
            return buildStorageUrl(cleanPath);
        }
        
        // Agar editing[key] yo'q bo'lsa, editing[key_url] yoki editing[key_path] ni tekshirish
        const candidates = [`${key}_url`, `${key}_path`];
        for (const candidate of candidates) {
            const value = editing?.[candidate];
            if (typeof value === "string" && value.length > 0 && value !== "null" && value !== "undefined") {
                if (value.startsWith("http://") || value.startsWith("https://")) {
                    return value;
                }
                const cleanPath = value.startsWith("/") ? value : `/${value}`;
                return buildStorageUrl(cleanPath);
            }
        }
        
        return null;
    };

    const updatePreview = (key: FileFieldName, nextUrl: string | null) => {
        setPreviews((prev) => {
            const prevUrl = prev[key];
            if (prevUrl && prevUrl.startsWith("blob:") && prevUrl !== nextUrl) {
                URL.revokeObjectURL(prevUrl);
            }
            return { ...prev, [key]: nextUrl };
        });
    };

    const handleFileSelect = (
        key: FileFieldName,
        file: File | undefined,
        onChange: (value: UploadValue) => void
    ) => {
        onChange(file);
        if (file) {
            updatePreview(key, URL.createObjectURL(file));
        } else {
            updatePreview(key, resolveEditingPreview(key));
        }
    };

    const previewsRef = useRef(previews);
    useEffect(() => {
        previewsRef.current = previews;
    }, [previews]);
    useEffect(() => {
        return () => {
            Object.values(previewsRef.current).forEach((url) => {
                if (url && url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useGetCompaniesInfinite();
    const companies = data?.pages.flatMap((page) => page.data) ?? [];
    useEffect(() => {
        if (editing) {
            reset({
                company_id: editing.company?.id?.toString() as any || "",
                name: editing.name ?? undefined,
                image_one: undefined,
                image_two: undefined,
                document: undefined,
            });
            
            setPreviews({
                image_one: resolveEditingPreview("image_one"),
                image_two: resolveEditingPreview("image_two"),
                document: resolveEditingPreview("document"),
            });
        } else {
            reset({
                company_id: "" as any,
                name: undefined,
                image_one: undefined,
                image_two: undefined,
                document: undefined,
            });
            setPreviews({
                image_one: null,
                image_two: null,
                document: null,
            });
        }
    }, [editing, reset, open]);
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
    const { mutate: createPlan } = useCratePlan();
    const { mutate: updatePlan } = useUpdatePlan();
    const handleSubmitBlock = (values: any) => {
        const parsed = blockPayloadSchema.parse(values);

        const onSuccess = () => {
            reset({
                company_id: "" as any,
                name: undefined,
                image_one: undefined,
                image_two: undefined,
                document: undefined,
            });
            setPreviews({
                image_one: null,
                image_two: null,
                document: null,
            });
            dispatch(closeModal());
        };

        if (editing) {
            updatePlan({ plan_id: editing.id, ...parsed }, { onSuccess });
        } else {
            createPlan(parsed, { onSuccess });
        }
    };

    const handleClose = () => {
        dispatch(closeModal())
    }
    return (
        <Dialog
            open={open}
            onClose={() => dispatch(closeModal())}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    backgroundColor: surfaceColor,
                    color: primaryText,
                    boxShadow: "0 25px 65px rgba(15,23,42,0.45)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    color: primaryText,
                    backgroundColor: surfaceColor,
                    borderBottom: `1px solid ${dividerColor}`,
                    padding: "20px 28px",
                }}
            >
                {editing ? "Rejani tahrirlash" : "Yangi reja"}
            </DialogTitle>

            <form onSubmit={handleSubmit(handleSubmitBlock)}>
                <DialogContent
                    sx={{
                        backgroundColor: contentColor,
                        color: primaryText,
                        borderTop: `1px solid ${dividerColor}`,
                    }}
                >
                    <div className="space-y-6" style={{ color: primaryText }}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
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
                                            (c) =>
                                                Number(c.id) ===
                                                Number(watch("company_id"))
                                ) || null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Kompaniya tanlang"
                                    error={!!errors.company_id}
                                    helperText={errors.company_id?.message}
                                            sx={textFieldStyles}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                        {isLoading ? (
                                                            <CircularProgress size={18} />
                                                        ) : null}
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
                            </div>
                        <TextField
                            label="Nomi"
                            size="small"
                            fullWidth
                            {...register("name")}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                                sx={textFieldStyles}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {(
                                ["image_one", "image_two", "document"] as FileFieldName[]
                            ).map(
                            (fieldName) => {
                                const labels: Record<FileFieldName, string> = {
                                    image_one: "1-rasm",
                                    image_two: "2-rasm",
                                    document: "3D rasm",
                                };
                                const hints: Record<FileFieldName, string> = {
                                    image_one: "JPG, PNG | 5120 KB gacha",
                                    image_two: "JPG, PNG | 5120 KB gacha",
                                    document: "JPG, PNG | 10240 KB gacha",
                                };
                                return (
                                    <Controller
                                        key={fieldName}
                                        control={control}
                                        name={fieldName}
                                        render={({ field }) => {
                                            const fieldError = errors[fieldName];
                                            const preview = previews[fieldName];
                                            return (
                                                <div className="space-y-2" style={{ color: primaryText }}>
                                                    <p
                                                        className="text-sm font-semibold"
                                                        style={{ color: primaryText }}
                                                    >
                                                        {labels[fieldName]}
                                                    </p>
                                                    <div
                                                        className="relative h-32 w-full cursor-pointer overflow-hidden rounded-2xl border border-dashed shadow-inner transition hover:border-indigo-300 hover:shadow-md"
                                                        style={{
                                                            borderColor: cardBorder,
                                                            backgroundColor: cardBg,
                                                        }}
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() =>
                                                            fileInputRefs.current[
                                                                fieldName
                                                            ]?.click()
                                                        }
                                                        onKeyDown={(event) => {
                                                            if (
                                                                event.key === "Enter" ||
                                                                event.key === " "
                                                            ) {
                                                                event.preventDefault();
                                                                fileInputRefs.current[
                                                                    fieldName
                                                                ]?.click();
                                                            }
                                                        }}
                                                    >
                                                        {preview ? (
                                                            <img
                                                                src={preview}
                                                                alt={labels[fieldName]}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="flex h-full flex-col items-center justify-center px-4 text-center text-xs font-medium"
                                                                style={{ color: filePlaceholderColor }}
                                                            >
                                                                Rasm tanlanmagan
                                                                <span
                                                                    className="text-[11px] font-normal"
                                                                    style={{ color: fileSubTextColor }}
                                                                >
                                                                    Bosib yangi rasm yuklang
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-center text-xs font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity hover:opacity-100">
                                                            {preview
                                                                ? "Rasmni almashtirish"
                                                                : "Rasm yuklash"}
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        ref={(node) => {
                                                            field.ref(node);
                                                            fileInputRefs.current[fieldName] =
                                                                node;
                                                        }}
                                                        onBlur={field.onBlur}
                                                        onChange={(event) => {
                                                            const input =
                                                                event.target as HTMLInputElement;
                                                            const file =
                                                                input.files?.[0] || undefined;
                                                            handleFileSelect(
                                                                fieldName,
                                                                file,
                                                                field.onChange
                                                            );
                                                        }}
                                                    />
                                                    <FormHelperText
                                                        error={!!fieldError}
                                                        sx={{
                                                            margin: 0,
                                                            fontSize: 11,
                                                            color: fieldError
                                                                ? "#dc2626"
                                                                : helperTextColor,
                                                        }}
                                                    >
                                                        {(fieldError?.message as string) ||
                                                            hints[fieldName]}
                                                    </FormHelperText>
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </DialogContent>

                <DialogActions
                    sx={{
                        backgroundColor: surfaceColor,
                        borderTop: `1px solid ${dividerColor}`,
                        padding: "16px 28px",
                        display: "flex",
                        gap: 1.5,
                    }}
                >
                    <Button
                        onClick={handleClose}
                        color="inherit"
                        sx={{
                            color: secondaryText,
                            borderRadius: 2,
                            paddingX: 3,
                            textTransform: "none",
                            border: `1px solid ${isDarkMode ? "rgba(148,163,184,0.4)" : "rgba(148,163,184,0.6)"}`,
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            paddingX: 3,
                            boxShadow: isDarkMode
                                ? "0 10px 25px rgba(79,70,229,0.45)"
                                : "0 10px 25px rgba(99,102,241,0.3)",
                        }}
                    >
                        {editing ? "Saqlash" : "Yaratish"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
