import { useDispatch, useSelector } from "react-redux";
import { editModal, openModal } from "@/store/features/objectSlice";
import ObjectModal from "@/components/dashboard/Objects/ObjectModal";
import { useDeleteObject, useObjects } from "@/hooks/modules/object";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Fab,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import GlobalPagination from "@/components/dashboard/GlobalPagination";
import { Add, Edit, Delete } from "@mui/icons-material";
import { RootState } from "@/store";

export default function Objects() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const open = useSelector((store: RootState) => store.object.open)
  const { data: objects, isLoading, refetch } = useObjects({ page });
  const data = objects?.data || [];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  useEffect(() => {
    if (!open) {
      refetch()
    }
  }, [open])
  const { mutate } = useDeleteObject()
  const handleDelete = (id: number) => {
    mutate(id, {
      onSuccess: () => refetch()
    })
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={600}>
          Obyektlar
        </Typography>
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
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead >
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nomi</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Viloyat</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tuman</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Manzil</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Boshlanish</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tugash</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Holat
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amallar</TableCell>

            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((obj: any, idx: number) => (
                <TableRow
                  key={idx}
                  hover
                  sx={{
                    "&:hover": { bgcolor: "grey.50" },
                    transition: "0.2s",
                  }}
                >
                  <TableCell>{obj.name}</TableCell>
                  <TableCell>{obj.region?.name || "-"}</TableCell>
                  <TableCell>{obj.district?.name || "-"}</TableCell>
                  <TableCell>{obj.address}</TableCell>
                  <TableCell>
                    {new Date(obj.start_date).toLocaleDateString("uz-UZ")}
                  </TableCell>
                  <TableCell>
                    {new Date(obj.end_date).toLocaleDateString("uz-UZ")}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={obj.is_active ? "Faol" : "Faol emas"}
                      color={obj.is_active ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Tahrirlash">
                      <IconButton
                        color="primary"
                        onClick={() => dispatch(editModal(obj))}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="O‘chirish">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(obj.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  Ma’lumot topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      {objects && (
        <GlobalPagination
          page={page}
          perPage={objects.per_page}
          total={objects.total}
          onPageChange={handlePageChange}
        />
      )}

      <ObjectModal />
    </>
  );
}
