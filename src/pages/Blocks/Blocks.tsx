import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Box,
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
  Chip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import GlobalPagination from "@/components/dashboard/GlobalPagination";
import { RootState } from "@/store";
import { useBlocks, useDeleteBlock } from "@/hooks/modules/block";
import { editModal, openModal } from "@/store/features/blockSlice";
import BlockModal from "@/components/dashboard/Blocks/BlockModal";

export default function Blocks() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const open = useSelector((store: RootState) => store.block.open);
  const { data: blocks, isLoading, refetch } = useBlocks({ page });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (!open) {
      refetch();
    }
  }, [open]);

  const { mutate } = useDeleteBlock();
  const handleDelete = (id: number) => {
    mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  return (
    <>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={600}>
          Bloklar
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

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nomi</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kompaniya</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Obyekt</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Holat
              </TableCell>
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
            ) : blocks.data.length > 0 ? (
              blocks.data.map((block: any, idx: number) => (
                <TableRow
                  key={idx}
                  hover
                  sx={{
                    "&:hover": { bgcolor: "grey.50" },
                    transition: "0.2s",
                  }}
                >
                  <TableCell>{block.name}</TableCell>
                  <TableCell>{block.company?.name || "-"}</TableCell>
                  <TableCell>{block.object?.name || "-"}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={block.is_active ? "Faol" : "Faol emas"}
                      color={block.is_active ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Tahrirlash">
                      <IconButton
                        color="primary"
                        onClick={() => dispatch(editModal(block))}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="O‘chirish">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(block.id)}
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
      {blocks && (
        <GlobalPagination
          page={page}
          perPage={blocks.per_page}
          total={blocks.total}
          onPageChange={handlePageChange}
        />
      )}
      <BlockModal />
    </>
  );
}
