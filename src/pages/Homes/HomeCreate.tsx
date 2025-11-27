import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  Typography,
  ButtonBase,
  Fab,
  Dialog,
  DialogContent,
  TextField,
  Button,
  Drawer,
  Autocomplete,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import { Add, DeleteOutline, DeleteSweep, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useGetBlocksInfinite } from "@/hooks/modules/block";
import { useGetPlansInfinite } from "@/hooks/modules/plan";
import { useCreateHomeList } from "@/hooks/modules/home";

export default function HomeCreate() {
  const [floors, setFloors] = useState<{ floor: number; homes: any[] }[]>([]);

  const [openHome, setOpenHome] = useState(false);
  const [homeCount, setHomeCount] = useState<number | null>(null);
  const [floorCount, setFloorCount] = useState<number>(1);

  const [collapsedFloors, setCollapsedFloors] = useState<number[]>([]);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [selectedHome, setSelectedHome] = useState<any>(null);

  const [allSelected, setAllSelected] = useState(false);
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);

  const {
    data: blockPages,
    fetchNextPage: fetchNextBlockPage,
    hasNextPage: hasNextBlockPage,
    isFetchingNextPage: isFetchingBlocks,
    isLoading: isLoadingBlocks,
  } = useGetBlocksInfinite();

  const blockList = useMemo(() => blockPages?.pages.flatMap((p: any) => p.data) ?? [], [blockPages]);
  const blockRef = useRef<any>(null);

  const handleBlockScroll = (event: any) => {
    const el = event.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      if (hasNextBlockPage && !isFetchingBlocks) fetchNextBlockPage();
    }
  };

  const {
    data: planPages,
    fetchNextPage: fetchNextPlanPage,
    hasNextPage: hasNextPlanPage,
    isFetchingNextPage: isFetchingPlans,
    isLoading: isLoadingPlans,
  } = useGetPlansInfinite({ block_id: selectedHome?.block_id });

  const planList = useMemo(() => planPages?.pages.flatMap((p: any) => p.data) ?? [], [planPages]);
  const planRef = useRef<any>(null);

  const handlePlanScroll = (event: any) => {
    const el = event.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      if (hasNextPlanPage && !isFetchingPlans) fetchNextPlanPage();
    }
  };

  const getHomeBorder = (floorNum: number, home: any, idx: number) => {
    if (allSelected) return "2px solid #1976d2";
    if (selectedFloors.includes(floorNum)) return "2px solid #1976d2";
    if (selectedColumns.includes(idx)) return "2px solid #1976d2";
    if (selectedHome?.id === home.id) return "2px solid #1976d2";
    return "2px solid transparent";
  };

  const handleAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setAllSelected(checked);

    if (!checked) {
      setSelectedFloors([]);
      setSelectedColumns([]);
      setSelectedHome(null);
    }
  };

  const handleFloorCheckboxChange = (floorNumber: number, checked: boolean) => {
    setSelectedFloors((prev) =>
      checked ? [...prev, floorNumber] : prev.filter((f) => f !== floorNumber)
    );
    if (!checked) setAllSelected(false);
  };

  const handleColumnCheckboxChange = (col: number, checked: boolean) => {
    setSelectedColumns((prev) =>
      checked ? [...prev, col] : prev.filter((c) => c !== col)
    );
    if (!checked) setAllSelected(false);
  };

  const handleSaveHome = () => {
    if (!selectedHome) return;

    const updatedFloors = floors.map((f) => {
      if (allSelected || selectedFloors.includes(f.floor)) {
        return { ...f, homes: f.homes.map(() => ({ ...selectedHome })) };
      }

      return {
        ...f,
        homes: f.homes.map((h, idx) => {
          if (selectedColumns.includes(idx)) return { ...selectedHome };
          if (h.id === selectedHome.id) return selectedHome;
          return h;
        }),
      };
    });

    setFloors(updatedFloors);
    setOpenDrawer(false);
  };

  const handleDeleteHome = (floorNumber: number, homeId: number) => {
    setFloors((prevFloors) => {
      const updatedFloors = prevFloors
        .map((floor) =>
          floor.floor === floorNumber
            ? { ...floor, homes: floor.homes.filter((home) => home.id !== homeId) }
            : floor
        )
        .filter((floor) => floor.homes.length > 0);

      if (selectedHome?.id === homeId) {
        setSelectedHome(null);
        setOpenDrawer(false);
      }

      return updatedFloors;
    });
  };

  const handleCreateHome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!homeCount || !floorCount) return;

    const lastFloorNumber = floors.length
      ? Math.max(...floors.map((item) => item.floor))
      : 0;

    const createHome = (floorNumber: number) => ({
      id: Date.now() + Math.random(),
      block_id: null,
      plan_id: null,
      number: 0,
      stage: floorNumber,
      square: 0,
      number_of_rooms: 0,
      price_repaired: "",
      price_no_repaired: "",
      is_repaired: false,
      is_residential: true,
      is_active: false,
      status: "sold",
    });

    const newFloors = Array.from({ length: floorCount }, (_, floorIdx) => {
      const floorNumber = lastFloorNumber + floorIdx + 1;

      return {
        floor: floorNumber,
        homes: Array.from({ length: homeCount }, () => createHome(floorNumber)),
      };
    });

    //@ts-ignore
    setFloors([...floors, ...newFloors]);
    setHomeCount(null);
    setFloorCount(1);
    setOpenHome(false);
  };
  const { mutate } = useCreateHomeList();
  const handleSave = () => {
    const items = floors.flatMap((f) =>
      f.homes.map((h) => ({
        ...h,
        stage: String(f.floor),
        price_no_repaired: Number(h.price_no_repaired),
        price_repaired: Number(h.price_repaired)
      }))
    );

    mutate(
      { items },
      {
        onSuccess: () => {
          alert("Hello");
        }
      }
    );
  };

  const toggleFloorCollapse = (floorNumber: number) => {
    setCollapsedFloors((prev) =>
      prev.includes(floorNumber)
        ? prev.filter((floor) => floor !== floorNumber)
        : [...prev, floorNumber]
    );
  };

  const handleDeleteFloor = (floorNumber: number) => {
    setFloors((prevFloors) => {
      const updatedFloors = prevFloors.filter((f) => f.floor !== floorNumber);

      if (selectedFloor?.floor === floorNumber) {
        setSelectedFloor(null);
        setSelectedHome(null);
        setOpenDrawer(false);
      }

      return updatedFloors;
    });

    setCollapsedFloors((prev) => prev.filter((f) => f !== floorNumber));
    setSelectedFloors((prev) => prev.filter((f) => f !== floorNumber));
    setAllSelected(false);
  };

  const handleDeleteSelectedFloors = () => {
    const floorsToDelete = allSelected ? floors.map((f) => f.floor) : selectedFloors;

    if (floorsToDelete.length === 0) return;

    setFloors((prevFloors) =>
      prevFloors.filter((floor) => !floorsToDelete.includes(floor.floor))
    );

    setSelectedFloors([]);
    setSelectedColumns([]);
    setSelectedHome(null);
    setSelectedFloor(null);
    setOpenDrawer(false);
    setAllSelected(false);
    setCollapsedFloors((prev) => prev.filter((f) => !floorsToDelete.includes(f)));
  };

  const collapseAllFloors = () => setCollapsedFloors(floors.map((f) => f.floor));
  const expandAllFloors = () => setCollapsedFloors([]);

  return (
    <>
      <Box flex={3} maxHeight="100vh" overflow="auto" sx={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 35%)", p: 2, borderRadius: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e5e7eb", background: "linear-gradient(135deg, #f0f9ff 0%, #ecfeff 40%, #ffffff 100%)" }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
            <div>
              <Typography variant="h6" fontWeight={700} color="primary">Uylarni yaratish</Typography>
              <Typography variant="body2" color="text.secondary">
                Qavat va xonadonlarni qo‘shing, so‘ng saqlab yuboring. Keraksiz uylarni istalgan payt o‘chirishingiz mumkin.
              </Typography>
            </div>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<Add />} onClick={() => setOpenHome(true)}>
                Qavat qo‘shish
              </Button>
              <Fab color="primary" size="medium" onClick={() => setOpenHome(true)}>
                <Add />
              </Fab>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontWeight={600}>Hamma uylarni tanlash</Typography>
              <Checkbox checked={allSelected} onChange={handleAllCheckboxChange} />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweep />}
                onClick={handleDeleteSelectedFloors}
              >
                Tanlangan qavatlarni o‘chirish
              </Button>
              <Button variant="outlined" onClick={collapseAllFloors}>
                Hammasini yig‘ish
              </Button>
              <Button variant="outlined" onClick={expandAllFloors}>
                Hammasini yoyish
              </Button>
              <Button
                onClick={() => handleSave()}
                variant="contained"
                color="primary"
                startIcon={<i className="fa-solid fa-floppy-disk"></i>}
              >
                Saqlash
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {floors.length === 0 && (
          <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px dashed #cbd5e1", backgroundColor: "#f8fafc", borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Hozircha uylar qo‘shilmagan
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Qavat va xonadonlar sonini tanlab yangi uylarni qo‘shishni boshlang.
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenHome(true)}>
              Uylar qo‘shish
            </Button>
          </Paper>
        )}

        <Stack spacing={3}>
          {floors
            .slice()
            .sort((a, b) => b.floor - a.floor)
            .map((f) => (
              <Paper
                key={f.floor}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: collapsedFloors.includes(f.floor)
                    ? "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
                    : "white",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography fontWeight={700} fontSize={18} color="primary">{f.floor}-qavat</Typography>
                    <Checkbox
                      checked={allSelected || selectedFloors.includes(f.floor)}
                      onChange={(e) => handleFloorCheckboxChange(f.floor, e.target.checked)}
                    />
                    <IconButton size="small" onClick={() => toggleFloorCollapse(f.floor)}>
                      {collapsedFloors.includes(f.floor) ? <ExpandMore /> : <ExpandLess />}
                    </IconButton>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {f.homes.length} ta xonadon
                    </Typography>
                    <Tooltip title="Qavatni o‘chirish">
                      <IconButton size="small" color="error" onClick={() => handleDeleteFloor(f.floor)}>
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                {!collapsedFloors.includes(f.floor) && (
                  <Box display="grid" gap={1.5} gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))">
                    {f.homes.map((h, idx) => (
                      <Paper
                        key={h.id}
                        component={ButtonBase}
                        onClick={() => {
                          setSelectedFloor(f);
                          setSelectedHome(h);
                          setOpenDrawer(true);
                        }}
                        sx={{
                          position: "relative",
                          cursor: "pointer",
                          p: 1.5,
                          borderRadius: 2.5,
                          textAlign: "left",
                          background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
                          boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.08)",
                          border: getHomeBorder(f.floor, h, idx),
                          transition: "transform 150ms ease, box-shadow 150ms ease",
                          '&:hover': {
                            transform: "translateY(-2px)",
                            boxShadow: "0px 15px 35px rgba(15, 23, 42, 0.12)",
                          },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography fontSize={13} fontWeight={700} color="#0f172a">
                            № {h.number || "-"}
                          </Typography>
                          <Tooltip title="Uy o‘chirish">
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteHome(f.floor, h.id);
                              }}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Typography fontSize={12} color="#0f172a" fontWeight={600}>
                          {h.number_of_rooms || 0} xonali
                        </Typography>
                        <Typography fontSize={12} color="#475569">
                          {h.square || 0} m²
                        </Typography>
                        <Stack direction="row" spacing={0.5} mt={1.5} flexWrap="wrap">
                          <Box
                            px={1}
                            py={0.5}
                            borderRadius={1}
                            bgcolor={h.status === "sold" ? "#fee2e2" : "#e0f2fe"}
                            color={h.status === "sold" ? "#991b1b" : "#0369a1"}
                            fontSize={11}
                            fontWeight={700}
                          >
                            {h.status === "sold" ? "Sotilgan" : "Bo‘sh"}
                          </Box>
                          {h.is_repaired && (
                            <Box
                              px={1}
                              py={0.5}
                              borderRadius={1}
                              bgcolor="#dcfce7"
                              color="#15803d"
                              fontSize={11}
                              fontWeight={700}
                            >
                              Ta’mirlangan
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
        </Stack>

        {floors[0]?.homes?.length ? (
          <Box display="flex" justifyContent="center" gap={4} mt={3}>
            {floors[0]?.homes.map((_, idx) => (
              <Checkbox
                key={idx}
                checked={selectedColumns.includes(idx) || allSelected}
                onChange={(e) => handleColumnCheckboxChange(idx, e.target.checked)}
              />
            ))}
          </Box>
        ) : null}

      </Box>

      <Dialog open={openHome} onClose={() => setOpenHome(false)} fullWidth>
        <DialogContent>
          <form onSubmit={handleCreateHome}>
            <TextField
              label="Qavatlar soni"
              type="number"
              size="small"
              fullWidth
              value={floorCount || ""}
              onChange={(e) => setFloorCount(Number(e.target.value))}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Har bir qavatdagi xonalar soni"
              type="number"
              size="small"
              fullWidth
              value={homeCount || ""}
              onChange={(e) => setHomeCount(Number(e.target.value))}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2, float: "right" }}>
              Yuborish
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box width={350} p={2}>
          {selectedHome && (
            <Box mt={2}>
              <Autocomplete
                size="small"
                fullWidth
                loading={isLoadingBlocks}
                options={blockList}
                value={blockList.find((b) => b.id === selectedHome.block_id) || null}
                getOptionLabel={(option) => option.name || ""}
                onChange={(_, val) => setSelectedHome({ ...selectedHome, block_id: val?.id || null })}
                ListboxProps={{ ref: blockRef, onScroll: handleBlockScroll, style: { maxHeight: 200, overflow: "auto" } }}
                sx={{ mb: 2 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Blok tanlang"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingBlocks ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <Autocomplete
                size="small"
                fullWidth
                loading={isLoadingPlans}
                options={planList}
                value={planList.find((p) => p.id === selectedHome.plan_id) || null}
                getOptionLabel={(option) => option.name || ""}
                onChange={(_, val) => setSelectedHome({ ...selectedHome, plan_id: val?.id || null })}
                ListboxProps={{ ref: planRef, onScroll: handlePlanScroll, style: { maxHeight: 200, overflow: "auto" } }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Plan tanlang"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingPlans ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <TextField fullWidth margin="dense" label="Xonadon raqami" value={selectedHome.number_of_rooms} onChange={(e) => setSelectedHome({ ...selectedHome, number: Number(e.target.value) })} />
              <TextField fullWidth margin="dense" label="Maydon (m²)" value={selectedHome.square} onChange={(e) => setSelectedHome({ ...selectedHome, square: Number(e.target.value) })} />
              <TextField fullWidth margin="dense" label="Ta’mirlangan narx" value={selectedHome.price_repaired} onChange={(e) => setSelectedHome({ ...selectedHome, price_repaired: e.target.value })} />
              <TextField fullWidth margin="dense" label="Ta’mirsiz narx" value={selectedHome.price_no_repaired} onChange={(e) => setSelectedHome({ ...selectedHome, price_no_repaired: e.target.value })} />

              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Checkbox checked={selectedHome.is_repaired} onChange={(e) => setSelectedHome({ ...selectedHome, is_repaired: e.target.checked })} />
                <Typography>Ta’mirlangan</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Checkbox checked={selectedHome.is_residential} onChange={(e) => setSelectedHome({ ...selectedHome, is_residential: e.target.checked })} />
                <Typography>Turar joy</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Checkbox checked={selectedHome.is_active} onChange={(e) => setSelectedHome({ ...selectedHome, is_active: e.target.checked })} />
                <Typography>Aktiv</Typography>
              </Box>

              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSaveHome}>
                Saqlash
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
