import React, { useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Add, DeleteOutline, DeleteSweep, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useGetBlocksInfinite } from "@/hooks/modules/block";
import { useGetPlansInfinite } from "@/hooks/modules/plan";
import { useCreateHomeList } from "@/hooks/modules/home";

export default function HomeCreate() {
  const theme = useTheme();
  const [floors, setFloors] = useState<{ floor: number; homes: any[] }[]>([]);

  const [openHome, setOpenHome] = useState(false);
  const [floorCount, setFloorCount] = useState<number>(1);

  const [openHomeModal, setOpenHomeModal] = useState(false);
  const [homeForm, setHomeForm] = useState<any | null>(null);
  const [homeTargetFloors, setHomeTargetFloors] = useState<number[]>([]);
  const [homeCount, setHomeCount] = useState<number>(1);

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

  const blockIdForPlans = selectedHome?.block_id ?? homeForm?.block_id;

  const {
    data: planPages,
    fetchNextPage: fetchNextPlanPage,
    hasNextPage: hasNextPlanPage,
    isFetchingNextPage: isFetchingPlans,
    isLoading: isLoadingPlans,
  } = useGetPlansInfinite({ block_id: blockIdForPlans });

  const planList = useMemo(() => planPages?.pages.flatMap((p: any) => p.data) ?? [], [planPages]);
  const planRef = useRef<any>(null);

  const handlePlanScroll = (event: any) => {
    const el = event.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      if (hasNextPlanPage && !isFetchingPlans) fetchNextPlanPage();
    }
  };

  const getHomeBorder = (floorNum: number, home: any, idx: number) => {
    const border = `2px solid ${theme.palette.primary.main}`;
    if (allSelected) return border;
    if (selectedFloors.includes(floorNum)) return border;
    if (selectedColumns.includes(idx)) return border;
    if (selectedHome?.id === home.id) return border;
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

  const getSelectedTargetFloors = () =>
    allSelected ? floors.map((f) => f.floor) : selectedFloors;

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
    if (!floorCount) return;

    const lastFloorNumber = floors.length
      ? Math.max(...floors.map((item) => item.floor))
      : 0;

    const newFloors = Array.from({ length: floorCount }, (_, floorIdx) => {
      const floorNumber = lastFloorNumber + floorIdx + 1;

      return {
        floor: floorNumber,
        homes: [],
      };
    });

    //@ts-ignore
    setFloors([...floors, ...newFloors]);
    setFloorCount(1);
    setOpenHome(false);
  };

  const getNextHomeNumber = (floorNumber: number) => {
    const targetFloor = floors.find((f) => f.floor === floorNumber);
    if (!targetFloor) return 1;

    const numbers = targetFloor.homes.map((home) => Number(home.number) || 0);
    const maxNumber = numbers.length ? Math.max(...numbers) : 0;

    return maxNumber + 1;
  };

  const handleOpenSelectedFloorsModal = () => {
    const targets = getSelectedTargetFloors();
    if (targets.length === 0) return;

    openCreateHomeModal(targets);
  };

  const openCreateHomeModal = (floorNumbers: number | number[]) => {
    const targetFloors = Array.isArray(floorNumbers) ? floorNumbers : [floorNumbers];
    if (targetFloors.length === 0) return;

    const initialFloor = targetFloors[0];
    const nextNumber = getNextHomeNumber(initialFloor);

    setHomeTargetFloors(targetFloors);
    setHomeCount(1);
    setHomeForm({
      id: Date.now() + Math.random(),
      block_id: null,
      plan_id: null,
      number: nextNumber,
      stage: initialFloor,
      square: 0,
      number_of_rooms: 0,
      price_repaired: "",
      price_no_repaired: "",
      is_repaired: false,
      is_residential: true,
      is_active: true,
      status: "available",
    });
    setOpenHomeModal(true);
  };

  const handleCreateHomeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!homeForm || homeTargetFloors.length === 0) return;

    const count = Math.max(1, homeCount || 1);

    setFloors((prevFloors) =>
      prevFloors.map((floor) => {
        if (!homeTargetFloors.includes(floor.floor)) return floor;

        const startNumber = floor.homes.reduce(
          (max, home) => Math.max(max, Number(home.number) || 0),
          0
        );

        const homesToAdd = Array.from({ length: count }, (_, idx) => ({
          ...homeForm,
          id: Date.now() + Math.random() + idx,
          number: startNumber + idx + 1,
          stage: floor.floor,
        }));

        return { ...floor, homes: [...floor.homes, ...homesToAdd] };
      })
    );

    setOpenHomeModal(false);
    setHomeTargetFloors([]);
    setHomeForm(null);
    setHomeCount(1);
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
      <Box
        flex={3}
        maxHeight="100vh"
        overflow="auto"
        sx={{
          backgroundColor: theme.palette.background.default,
          p: 2,
          borderRadius: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.primary.main, 0.08)
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.16)} 50%, ${theme.palette.background.paper} 100%)`,
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
            <div>
              <Typography variant="h6" fontWeight={700} color="primary">Uylarni yaratish</Typography>
              <Typography variant="body2" color="text.secondary">
                Qavatlarni qo‘shing va uylarga bittalab ma’lumot kiriting. Har bir qavatda uy raqami avtomatik tarzda belgilanadi.
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
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleOpenSelectedFloorsModal}
                disabled={floors.length === 0 || (!allSelected && selectedFloors.length === 0)}
              >
                Tanlangan qavatlarga uy qo‘shish
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
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              border: `1px dashed ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Hozircha uylar qo‘shilmagan
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Qavatlarni qo‘shing va har bir uy uchun ma’lumotlarni alohida kiritib boring.
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
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0px 10px 30px rgba(0,0,0,0.35)"
                      : "0px 10px 30px rgba(15,23,42,0.08)",
                }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} mb={2} spacing={1.5}>
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
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => openCreateHomeModal(f.floor)}
                    >
                      Uy qo‘shish
                    </Button>
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
                  <Box display="grid" gap={1.5} gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))">
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
                          background:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.primary.main, 0.12)
                              : alpha(theme.palette.primary.light, 0.2),
                          color: theme.palette.text.primary,
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0px 12px 25px rgba(0,0,0,0.35)"
                              : "0px 12px 25px rgba(15,23,42,0.12)",
                          border: getHomeBorder(f.floor, h, idx),
                          transition: "transform 150ms ease, box-shadow 150ms ease",
                          '&:hover': {
                            transform: "translateY(-2px)",
                            boxShadow:
                              theme.palette.mode === "dark"
                                ? "0px 16px 35px rgba(0,0,0,0.45)"
                                : "0px 15px 35px rgba(15, 23, 42, 0.14)",
                          },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography fontSize={13} fontWeight={700} color={theme.palette.text.primary}>
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
                        <Typography fontSize={12} color={theme.palette.text.primary} fontWeight={600}>
                          {h.number_of_rooms || 0} xonali
                        </Typography>
                        <Typography fontSize={12} color="text.secondary">
                          {h.square || 0} m²
                        </Typography>
                        <Stack direction="row" spacing={0.5} mt={1.5} flexWrap="wrap">
                          <Box
                            px={1}
                            py={0.5}
                            borderRadius={1}
                            bgcolor={
                              h.status === "sold"
                                ? alpha(theme.palette.error.main, 0.1)
                                : alpha(theme.palette.success.main, 0.12)
                            }
                            color={h.status === "sold" ? theme.palette.error.dark : theme.palette.success.dark}
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
                              bgcolor={alpha(theme.palette.success.main, 0.16)}
                              color={theme.palette.success.main}
                              fontSize={11}
                              fontWeight={700}
                            >
                              Ta’mirlangan
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    ))}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        borderStyle: "dashed",
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.secondary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: theme.palette.background.default,
                      }}
                    >
                      <Button startIcon={<Add />} onClick={() => openCreateHomeModal(f.floor)}>
                        Uy qo‘shish
                      </Button>
                    </Paper>
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
            <Typography variant="h6" fontWeight={700} mb={2}>
              Yangi qavat qo‘shish
            </Typography>
            <TextField
              label="Qo‘shiladigan qavatlar soni"
              type="number"
              size="small"
              fullWidth
              value={floorCount || ""}
              onChange={(e) => setFloorCount(Number(e.target.value))}
              sx={{ mb: 1.5 }}
            />
            <Typography variant="body2" color="text.secondary" mb={2}>
              Qavatlar qo‘shilgach, har biriga uylarni bittalab kiritishingiz mumkin.
            </Typography>
            <Button type="submit" variant="contained" sx={{ mt: 1, float: "right" }}>
              Saqlash
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openHomeModal}
        onClose={() => {
          setOpenHomeModal(false);
          setHomeForm(null);
          setHomeTargetFloors([]);
          setHomeCount(1);
        }}
        fullWidth
      >
        <DialogContent>
          <form onSubmit={handleCreateHomeSubmit}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              {homeTargetFloors.length > 1
                ? "Tanlangan qavatlar uchun uy qo‘shish"
                : homeTargetFloors[0]
                  ? `${homeTargetFloors[0]}-qavat uchun uy qo‘shish`
                  : "Uy qo‘shish"}
            </Typography>
            {homeTargetFloors.length > 0 && (
              <Typography variant="body2" color="text.secondary" mb={1.5}>
                {homeTargetFloors.length > 1
                  ? `Uylar ${homeTargetFloors.join(", ")}-qavatlarga qo‘shiladi.`
                  : `${homeTargetFloors[0]}-qavatga uy qo‘shiladi.`}
              </Typography>
            )}

            <Stack spacing={1.5}>
              <Autocomplete
                size="small"
                fullWidth
                loading={isLoadingBlocks}
                options={blockList}
                value={blockList.find((b) => b.id === homeForm?.block_id) || null}
                getOptionLabel={(option) => option.name || ""}
                onChange={(_, val) => setHomeForm((prev: any) => ({ ...prev, block_id: val?.id || null, plan_id: null }))}
                ListboxProps={{ ref: blockRef, onScroll: handleBlockScroll, style: { maxHeight: 200, overflow: "auto" } }}
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
                value={planList.find((p) => p.id === homeForm?.plan_id) || null}
                getOptionLabel={(option) => option.name || ""}
                onChange={(_, val) => setHomeForm((prev: any) => ({ ...prev, plan_id: val?.id || null }))}
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

              <TextField
                fullWidth
                label="Uy raqami"
                value={homeForm?.number || ""}
                disabled
                helperText="Raqam avtomatik belgilanadi"
              />
              <TextField
                fullWidth
                label="Qavatdagi uylar soni"
                type="number"
                value={homeCount || ""}
                inputProps={{ min: 1 }}
                onChange={(e) => setHomeCount(Number(e.target.value))}
              />
              <TextField
                fullWidth
                label="Xonalar soni"
                type="number"
                value={homeForm?.number_of_rooms || ""}
                onChange={(e) => setHomeForm((prev: any) => ({ ...prev, number_of_rooms: Number(e.target.value) }))}
              />
              <TextField
                fullWidth
                label="Maydon (m²)"
                type="number"
                value={homeForm?.square || ""}
                onChange={(e) => setHomeForm((prev: any) => ({ ...prev, square: Number(e.target.value) }))}
              />
              <TextField
                fullWidth
                label="Ta’mirlangan narx"
                value={homeForm?.price_repaired || ""}
                onChange={(e) => setHomeForm((prev: any) => ({ ...prev, price_repaired: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Ta’mirsiz narx"
                value={homeForm?.price_no_repaired || ""}
                onChange={(e) => setHomeForm((prev: any) => ({ ...prev, price_no_repaired: e.target.value }))}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    checked={homeForm?.is_repaired || false}
                    onChange={(e) => setHomeForm((prev: any) => ({ ...prev, is_repaired: e.target.checked }))}
                  />
                  <Typography>Ta’mirlangan</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    checked={homeForm?.is_residential || false}
                    onChange={(e) => setHomeForm((prev: any) => ({ ...prev, is_residential: e.target.checked }))}
                  />
                  <Typography>Turar joy</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    checked={homeForm?.status === "sold"}
                    onChange={(e) => setHomeForm((prev: any) => ({ ...prev, status: e.target.checked ? "sold" : "available" }))}
                  />
                  <Typography>Sotilgan</Typography>
                </Box>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={1.5} mt={3}>
              <Button variant="text" onClick={() => setOpenHomeModal(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" variant="contained">
                Uy qo‘shish
              </Button>
            </Stack>
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

              <TextField fullWidth margin="dense" label="Uy raqami" value={selectedHome.number} disabled helperText="Raqam avtomatik" />
              <TextField fullWidth margin="dense" label="Xonalar soni" value={selectedHome.number_of_rooms} onChange={(e) => setSelectedHome({ ...selectedHome, number_of_rooms: Number(e.target.value) })} />
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
