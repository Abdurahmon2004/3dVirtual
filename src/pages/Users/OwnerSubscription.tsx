import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Fab,
} from "@mui/material";
import {
  useSubscriptionAll,
} from "@/hooks/modules/usersSubscription";
import OwnerSubcriptionModal from "@/components/dashboard/userSubcription/OwnerSubcriptionModal";
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { openEditModal, openModal } from "@/store/features/ownerSlice";
import dayjs from "dayjs";
import { RootState } from "@/store";
import { useEffect } from "react";
import { Add } from "@mui/icons-material";

const OwnerSubscription: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ownerId = searchParams.get("owner_id");
  const dispatch = useDispatch();
  const open = useSelector((store: RootState) => store.owner.open)
  const { data: allSubscriptions, isLoading, refetch } = useSubscriptionAll({
    owner_id: ownerId,
  });
  useEffect(() => {
    if (!open) {
      refetch();
    }
  }, [open])

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="relative w-full max-w-sm">

        </div>

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
      </div>

      {/* TABLE */}
      <div className="p-4">
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.03)" }}>
                <TableCell sx={{ fontWeight: 600 }}>Narx</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Valyuta</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Boshlanish sana</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tugash sana</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Holat</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amallar</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : allSubscriptions?.length ? (
                allSubscriptions.map((item: any) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>{parseFloat(item.price).toLocaleString()}</TableCell>
                    <TableCell>{item.currency}</TableCell>
                    <TableCell>
                      {dayjs(item.start_date).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {dayjs(item.end_date).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {item.is_active ? (
                        <Chip label="Faol" color="success" size="small" />
                      ) : (
                        <Chip label="Faol emas" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() =>
                          dispatch(
                            openEditModal({
                              id: item.id,
                              price: item.price,
                              currency: item.currency,
                              start_date: item.start_date,
                            })
                          )
                        }
                      >
                        <i className="fas fa-pen"></i>
                      </IconButton>

                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ color: "text.secondary", py: 4 }}
                  >
                    Maʼlumot topilmadi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <OwnerSubcriptionModal />
    </>
  );
};

export default OwnerSubscription;
