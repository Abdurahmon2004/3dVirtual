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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useGetBlocksInfinite } from "@/hooks/modules/block";
import { useGetPlansInfinite } from "@/hooks/modules/plan";
import { useCreateHomeList } from "@/hooks/modules/home";

export default function HomeCreate() {
  const [floors, setFloors] = useState([
    {
      floor: 1,
      homes: [
        { id: 1, block_id: null, plan_id: null, number: "31", stage: 1, square: 63, number_of_rooms: 3, price_repaired: "8734636343", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" },
        { id: 2, block_id: null, plan_id: null, number: "32", stage: 1, square: 63, number_of_rooms: 3, price_repaired: "8734636343", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" },
        { id: 3, block_id: null, plan_id: null, number: "33", stage: 1, square: 63, number_of_rooms: 3, price_repaired: "8734636343", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" },
        { id: 4, block_id: null, plan_id: null, number: "34", stage: 1, square: 63, number_of_rooms: 3, price_repaired: "8734636343", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" },
        { id: 5, block_id: null, plan_id: null, number: "35", stage: 1, square: 63, number_of_rooms: 3, price_repaired: "8734636343", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" },
        { id: 6, block_id: null, plan_id: null, number: "36", stage: 1, square: 63, number_of_rooms: 3, price_repaired: "8734636343", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" }
      ]
    },
    {
      floor: 2,
      homes: [
        { id: 7, block_id: null, plan_id: null, number: "25", stage: 2, square: 29.8, number_of_rooms: 1, price_repaired: "734574835783", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" },
        { id: 8, block_id: null, plan_id: null, number: "26", stage: 2, square: 40, number_of_rooms: 2, price_repaired: "734574835783", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" },
        { id: 9, block_id: null, plan_id: null, number: "27", stage: 2, square: 58.2, number_of_rooms: 2, price_repaired: "734574835783", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" }
      ]
    },
    {
      floor: 3,
      homes: [
        { id: 10, block_id: null, plan_id: null, number: "14", stage: 3, square: 40, number_of_rooms: 2, price_repaired: "3443788347", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" },
        { id: 11, block_id: null, plan_id: null, number: "18", stage: 3, square: 29.8, number_of_rooms: 1, price_repaired: "3443788347", price_no_repaired: "", is_repaired: false, is_residential: true, is_active: false, status: "sold" }
      ]
    }
  ]);

  const [openHome, setOpenHome] = useState(false);
  const [homeCount, setHomeCount] = useState<number | null>(null);

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

  const handleCreateHome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!homeCount) return;

    const newData = {
      floor: floors.length + 1,
      homes: Array.from({ length: homeCount }, () => ({
        id: Date.now() + Math.random(),
        number: 0,
        rooms: 0,
        price: "0",
        total: "0 UZS",
        square: "0",
        status: "sold",
      })),
    };
    //@ts-ignore
    setFloors([...floors, newData]);
    setHomeCount(null);
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

  return (
    <>
      <Box flex={3} maxHeight="100vh" overflow="auto">

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>Uylar</Typography>
          <Fab color="primary" size="medium">
            <Add />
          </Fab>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography fontWeight={600}>All</Typography>
            <Checkbox checked={allSelected} onChange={handleAllCheckboxChange} />
            <Add className="cursor-pointer" onClick={() => setOpenHome(true)} />

          </Box>
          <Box><Button onClick={() => handleSave()} variant="contained" color="primary"> <i className="fa-solid fa-floppy-disk"></i> Saqlash </Button></Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={4}>
          {floors.slice().reverse().map((f) => (
            <Box key={f.floor} display="flex" gap={2}>
              <Box width={50} textAlign="center">
                <Typography fontWeight={600}>{f.floor}</Typography>
                <Checkbox
                  checked={allSelected || selectedFloors.includes(f.floor)}
                  onChange={(e) => handleFloorCheckboxChange(f.floor, e.target.checked)}
                />
              </Box>

              <Box display="flex" gap={1} flexWrap="wrap">
                {f.homes.map((h, idx) => (
                  <ButtonBase
                    key={h.id}
                    onClick={() => {
                      setSelectedFloor(f);
                      setSelectedHome(h);
                      setOpenDrawer(true);
                    }}
                    sx={{
                      cursor: "pointer",
                      width: 150,
                      p: 1.2,
                      borderRadius: 2,
                      textAlign: "left",
                      background: h.status === "sold" ? "#e53935" : "#ffffff",
                      color: h.status === "sold" ? "#fff" : "#000",
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                      border: getHomeBorder(f.floor, h, idx),
                    }}
                  >
                    <Typography fontSize={13} fontWeight={600}>№ {h.number}</Typography>
                    <Typography fontSize={12}>{h.number_of_rooms} x</Typography>
                    <Typography fontSize={12}>{h.square} m²</Typography>
                  </ButtonBase>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Box display="flex" justifyContent="center" gap={4} mt={3}>
          {floors[0]?.homes.map((_, idx) => (
            <Checkbox
              key={idx}
              checked={selectedColumns.includes(idx) || allSelected}
              onChange={(e) => handleColumnCheckboxChange(idx, e.target.checked)}
            />
          ))}
        </Box>

      </Box>

      <Dialog open={openHome} onClose={() => setOpenHome(false)} fullWidth>
        <DialogContent>
          <form onSubmit={handleCreateHome}>
            <TextField
              label="Xonalar soni"
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
