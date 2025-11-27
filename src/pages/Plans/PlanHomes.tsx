import GlobalPagination from "@/components/dashboard/GlobalPagination";
import { useBlocks } from "@/hooks/modules/block";
import { useDeletePlanHome, usePlanHomes } from "@/hooks/modules/plan.home";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Chip, Fab, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";


export default function PlanHomes() {
    const [searchParams] = useSearchParams();
    const plan_id = searchParams.get('plan_id');
    const [page, setPage] = useState(1);
    const { data: planHomes, isLoading, refetch } = usePlanHomes({ page, plan_id });
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    const { mutate } = useDeletePlanHome();
    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: () => refetch(),
        });
    };
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h6" fontWeight={600}>
                    Reja uylari
                </Typography>
                <Fab
                    color="primary"
                    size="medium"
                    sx={{
                        textTransform: "none",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                    }}
                >
                    <Link to={`/settings/add-images?plan_id=${plan_id}`} >

                        <Add />
                    </Link>
                </Fab>
            </Box>
            {/* TABLE */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Nomi</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Kompaniya</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Yaratilgan vaqti</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Amallar</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    Yuklanmoqda...
                                </TableCell>
                            </TableRow>
                        ) : planHomes.data.length > 0 ? (
                            planHomes.data.map((home: any, idx: number) => (
                                <TableRow
                                    key={idx}
                                    hover
                                    sx={{
                                        "&:hover": { bgcolor: "grey.50" },
                                        transition: "0.2s",
                                    }}
                                >
                                    <TableCell>{home.name}</TableCell>
                                    <TableCell>{home.company?.name || "-"}</TableCell>
                                    <TableCell>{new Date(home.created_at).toLocaleDateString("uz-UZ") || "-"}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Tahrirlash">
                                            <Link to={`/edit-vizual?plan_item_id=${home.id}&plan_id=${plan_id}`}
                                                color="primary"
                                            >
                                                <Edit fontSize="small" />
                                            </Link>
                                        </Tooltip>
                                        <Tooltip title="O‘chirish">
                                            <IconButton
                                                color="error"
                                                onClick={()=>handleDelete(home.id)}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    Ma’lumot topilmadi
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* PAGINATION */}
            {planHomes && (
                <GlobalPagination
                    page={page}
                    perPage={planHomes.per_page}
                    total={planHomes.total}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    )
}
