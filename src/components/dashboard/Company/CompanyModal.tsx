import { RootState } from "@/store";
import { closeModal } from "@/store/features/companySlice";
import {
    Box,
    Button,
    Dialog,
    Stack,
    Switch,
    TextField,
    Typography,
    Fade,
    alpha
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddCompany, useUpdateCompany } from "@/hooks/modules/companies";
const CompanySchema = z.object({
    name: z.string().min(1, "Kompaniya nomi majburiy."),
    is_active: z.boolean(),
});

type CompanyFormValues = z.infer<typeof CompanySchema>;

export default function CompanyModal() {
    const open = useSelector((store: RootState) => store.company.open);
    const editingCompany = useSelector((store: RootState) => store.company.editing);
    const dispatch = useDispatch();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
        setValue,
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(CompanySchema),
        defaultValues: {
            name: "",
            is_active: true,
        },
        mode: "onChange",
    });
    const addCompanyMutation = useAddCompany();
    const updateCompanyMutation = useUpdateCompany();
    const handleClose = () => {
        dispatch(closeModal());
        reset(); 
    };
    useEffect(() => {
        if (open && editingCompany) {
            setValue("name", editingCompany.name);
            setValue("is_active", editingCompany.is_active);
        } else if (open && !editingCompany) {
             reset({ name: "", is_active: true });
        }
    }, [open, editingCompany, setValue, reset]);
    const onSubmit = (data: CompanyFormValues) => {
        const payload = { ...data, company_id: editingCompany ? editingCompany.id : undefined };

        if (editingCompany) {
            updateCompanyMutation.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                },
                onError: (error) => {
                }
            });
        } else {
            addCompanyMutation.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                },
                onError: (error) => {
                }
            });
        }
    };

    const isLoading = isSubmitting || addCompanyMutation.isPending || updateCompanyMutation.isPending;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Fade}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
                    overflow: "hidden"
                }
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ p: 3 }}> 
                    <Stack spacing={3}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 600,
                                            color: "text.secondary"
                                        }}
                                    >
                                        Kompaniya nomi *
                                    </Typography>
                                    <TextField
                                        {...field}
                                        size="small"
                                        placeholder="Kompaniya nomini kiriting"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                </Box>
                            )}
                        />
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Box>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: 600, mb: 0.5 }}
                                            >
                                                Holat
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "text.secondary" }}
                                            >
                                                {field.value
                                                    ? "Kompaniya faol"
                                                    : "Kompaniya nofaol"}
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={field.value}
                                            onChange={field.onChange}
                                            inputRef={field.ref}
                                        />
                                    </Stack>
                                </Box>
                            )}
                        />
                    </Stack>
                </Box>

                <Box
                    sx={{
                        p: 3, 
                        pt: 0,
                        display: "flex",
                        gap: 2
                    }}
                >
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        fullWidth
                        size="large" 
                        disabled={isLoading}
                        sx={{
                            borderRadius: 2,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: "none",
                            borderColor: alpha("#000", 0.12),
                            color: "text.primary",
                            "&:hover": {
                                borderColor: alpha("#000", 0.24),
                                bgcolor: alpha("#000", 0.02)
                            }
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        size="large" 
                        variant="contained"
                        fullWidth
                        type="submit"
                        startIcon={<CheckCircleIcon />}
                        disabled={isLoading}
                    >
                        {isLoading ? "Yuklanmoqda..." : (editingCompany ? "Saqlash" : "Qo'shish")}
                    </Button>
                </Box>
            </form>
        </Dialog>
    );
}