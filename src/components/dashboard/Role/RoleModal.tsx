import { RootState } from "@/store";
import { closeModal } from "@/store/features/roleSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";
import { useEffect } from "react";
import { IRole } from "@/types/modules/roles.types";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateRole, useUpdateRole } from "@/hooks/modules/roles";

const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Rol nomi kiritilishi shart")
    .min(2, "Kamida 2 ta belgidan iborat bo'lishi kerak"),
  status: z.boolean(),
});

const defaultValues: IRole = {
  name: "",
  status: true,
};

export default function RoleModal() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { open, editing } = useSelector((state: RootState) => state.role);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IRole>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  useEffect(() => {
    if (editing) {
      reset({
        name: editing.name,
        status: editing.status,
      });
    } else {
      reset(defaultValues);
    }
  }, [editing, reset]);
  const onSubmitHandler = async (data: IRole) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ ...editing, role_id: editing.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      dispatch(closeModal());
      reset(defaultValues);
    } catch (error) {
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(closeModal())}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                label="Rol nomi"
                placeholder="Kassir"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={
                  errors.name ? (errors.name.message as React.ReactNode) : ""
                }
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label={field.value ? "Faol (true)" : "Faol emas (false)"}
                />
              </Box>
            )}
          />
          {errors.status && (
            <FormHelperText error sx={{ ml: 1 }}>
              {errors.status.message as React.ReactNode}
            </FormHelperText>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => dispatch(closeModal())}
          disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
        >
          Bekor qilish
        </Button>
        <Button
          onClick={handleSubmit(onSubmitHandler)}
          variant="contained"
          type="submit"
          disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
        >
          {editing ? "Yangilash" : "Saqlash"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
