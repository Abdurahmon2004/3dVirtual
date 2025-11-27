import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Fab,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Stack,
    Paper,
    Tooltip,
    Fade,
    Chip,
} from "@mui/material";
import { Add, Edit, Delete, Business, Home } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import GlobalPagination from "@/components/dashboard/GlobalPagination";
import { editModal, openModal } from "@/store/features/planSlice";
import PlanModal from "@/components/dashboard/Plans/PlanModal";
import { useDeletePlan, usePlans } from "@/hooks/modules/plan";
import { Link } from "react-router";

export default function Plans() {
    const [page, setPage] = useState(1);
    const { data: plans, refetch, isLoading } = usePlans({ page: page });
    const { mutate: deleteMutation, isSuccess } = useDeletePlan();

    const dispatch = useDispatch();
    const open = useSelector((store: RootState) => store.plan.open);
    useEffect(() => {
        if (!open || isSuccess) {
            refetch();
        }
    }, [open, isSuccess]);
    const handleDelete = (id: number) => {
        deleteMutation(id);
    };
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Business color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                        Rejalar
                    </Typography>
                </Stack>
                <Fab
                    color="primary"
                    size="medium"
                    sx={{
                        textTransform: "none",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                    }}
                    onClick={() => dispatch(openModal())}
                >
                    <Add />
                </Fab>
            </Stack>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                }}
            >
                {isLoading ? (
                    <Box textAlign="center" p={5}>
                        <CircularProgress />
                    </Box>
                ) : plans?.data?.length === 0 ? (
                    <Box textAlign="center" py={5}>
                        <Typography variant="body1" color="text.secondary">
                            Rejalar mavjud emas !
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Fade in>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Nomi</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Kompaniya</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Yaratilgan vaqti</TableCell>
                                        <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                                            Amallar
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {plans?.data?.map((item: any, idx: number) => (
                                        <TableRow
                                            key={item.id}
                                            hover
                                            sx={{
                                                "&:hover": { backgroundColor: "#f9fafb" },
                                                transition: "0.2s",
                                            }}
                                        >
                                            <TableCell>{idx + 1 + (page - 1) * plans.per_page}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item?.company?.name}</TableCell>
                                            <TableCell>
                                                {new Date(item.created_at).toLocaleDateString("uz-UZ")}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Xonalar">
                                                    <Link to={`/settings/plan-homes?plan_id=${item.id}`}
                                                        color="primary"
                                                    >
                                                        <Home fontSize="small" />
                                                    </Link>
                                                </Tooltip>
                                                <Tooltip title="Tahrirlash">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => dispatch(editModal(item))}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="O‘chirish">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Fade>
                        <GlobalPagination
                            page={page}
                            perPage={plans.per_page}
                            total={plans.total}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </Paper>
            <PlanModal />
        </div>
    );
}
