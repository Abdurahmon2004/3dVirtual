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
import { Add, Edit, Delete, Business } from "@mui/icons-material";
import { useDeleteCompany, useGetCompanies } from "@/hooks/modules/companies";
import { useDispatch, useSelector } from "react-redux";
import { editCompany, openModal } from "@/store/features/companySlice";
import { RootState } from "@/store";
import GlobalPagination from "@/components/dashboard/GlobalPagination";
import CompanyModal from "@/components/dashboard/Company/CompanyModal";

interface Company {
  id: number;
  name: string;
  is_active: boolean;
}

export default function Companies() {
  const [page, setPage] = useState(1);
  const { data: companies, isLoading, refetch } = useGetCompanies({page:page});
  const { mutate: deleteMutation, isSuccess } = useDeleteCompany();

  const dispatch = useDispatch();
  const open = useSelector((store: RootState) => store.company.open);
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
            Kompaniyalar
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
        ) : companies?.data?.length === 0 ? (
          <Box textAlign="center" py={5}>
            <Typography variant="body1" color="text.secondary">
              Kompaniyalar mavjud emas !
            </Typography>
          </Box>
        ) : (
          <>
            <Fade in>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nomi</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Holat</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                      Amallar
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies?.data?.map((item: Company, idx: number) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: "#f9fafb" },
                        transition: "0.2s",
                      }}
                    >
                      <TableCell>{idx + 1 + (page - 1) * companies.per_page}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.is_active ? (
                          <Chip label="Faol" color="success" size="small" />
                        ) : (
                          <Chip label="Faol emas" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Tahrirlash">
                          <IconButton
                            color="primary"
                            onClick={() => dispatch(editCompany(item))}
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
              perPage={companies.per_page}
              total={companies.total}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Paper>
      <CompanyModal />
    </div>
  );
}
