import { RootState } from "@/store";
import { closeModal } from "@/store/features/ownerSlice";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    MenuItem,
    Box,
    IconButton,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useCreateSubscription, useUpdateSubscription } from "@/hooks/modules/usersSubscription";

const currencies = ["USD", "UZS"];

const SubscriptionSchema = z.object({
    price: z
        .string()
        .refine((val) => val.trim() !== "", "Narx kiritilishi shart")
        .refine((val) => !isNaN(Number(val)), "Faqat raqam kiritish kerak")
        .refine((val) => parseFloat(val) >= 0, "Narx 0 dan kam bo‘lmasligi kerak"),
    currency: z.enum(["USD", "UZS"]),
    start_date: z
        .any()
        .refine(
            (val) => val instanceof Date && !isNaN(val.getTime()),
            "Sana kiritilishi shart"
        )
        .transform((val) => new Date(val)),
});

type SubscriptionForm = z.infer<typeof SubscriptionSchema>;

export default function OwnerSubscriptionModal() {
    const { open, mode, selectedSubscription } = useSelector(
        (store: RootState) => store.owner
    );
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const ownerId = searchParams.get("owner_id");

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<SubscriptionForm>({
        resolver: zodResolver(SubscriptionSchema),
        defaultValues: {
            price: "",
            currency: "USD",
            start_date: dayjs().toDate(),
        },
    });

    const { mutate: createSub, isSuccess: isCreated } = useCreateSubscription();
    const { mutate: updateSub, isSuccess: isUpdated } = useUpdateSubscription();

    const onSubmit = (data: SubscriptionForm) => {
        const submitData = {
            owner_id: parseInt(ownerId || "0"),
            price: parseFloat(data.price),
            currency: data.currency,
            start_date: dayjs(data.start_date).format("YYYY-MM-DD"),
        };

        if (mode === "create") {
            createSub(submitData);
        } else if (mode === "edit" && selectedSubscription?.id) {
            updateSub({
                owner_subscription_id: selectedSubscription.id,
                ...submitData,
            });
        }
    };

    useEffect(() => {
        if (isCreated || isUpdated) {
            dispatch(closeModal());
            reset();
        }
    }, [isCreated, isUpdated]);

    // 🔁 Modal ochilganda update ma'lumotlarini to‘ldirish
    useEffect(() => {
        if (mode === "edit" && selectedSubscription) {
            setValue("price", selectedSubscription.price);
            setValue("currency", selectedSubscription.currency);
            setValue("start_date", dayjs(selectedSubscription.start_date).toDate());
        }
    }, [mode, selectedSubscription]);

    const handleClose = () => {
        dispatch(closeModal());
        reset();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 600,
                }}
            >
                {mode === "create" ? "Yangi obuna" : "Obunani tahrirlash"}
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
                >
                    {/* PRICE */}
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Narx"
                                type="number"
                                variant="outlined"
                                size="small"
                                fullWidth
                                error={!!errors.price}
                                helperText={errors.price?.message}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        )}
                    />

                    {/* CURRENCY */}
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Valyuta"
                                variant="outlined"
                                size="small"
                                fullWidth
                            >
                                {currencies.map((curr) => (
                                    <MenuItem key={curr} value={curr}>
                                        {curr}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* START DATE */}
                    <Controller
                        name="start_date"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                label="Boshlanish sanasi"
                                value={dayjs(field.value)}
                                onChange={(date) => field.onChange(date?.toDate())}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                        error: !!errors.start_date,
                                        helperText: errors.start_date?.message,
                                    },
                                }}
                            />
                        )}
                    />

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <Button variant="outlined" onClick={handleClose} fullWidth>
                            Bekor qilish
                        </Button>
                        <Button type="submit" variant="contained" fullWidth>
                            {mode === "create" ? "Saqlash" : "Yangilash"}
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
