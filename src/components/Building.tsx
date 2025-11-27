import React, { useState, useMemo, ChangeEvent, useEffect, useRef } from "react";
import { Box, Button, Dialog, DialogContent, Divider, Drawer, MenuItem, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useGetByIdBlockHome, useGetObjectsInfinite } from "@/hooks/modules/object";
import { useGetByIdHome } from "@/hooks/modules/home";
import utils from "@/helpers/utils";
interface Apartment {
    id: number;
    number: string | number;
    square: number;
    stage: number | string;
    status?: "available" | "sold" | "reserved";
    number_of_rooms?: number;
    price_repaired?: string | number;
    block_id?: number;
}
interface BlockResponse {
    id: number;
    name: string;
    homes: Apartment[];
}
interface BackendData {
    blocks: BlockResponse[];
}
interface TransformedFloor {
    floor: number;
    homes: Apartment[];
}
interface TransformedBlock {
    block_id: number;
    block_name: string;
    floors: TransformedFloor[];
}
const Item = ({ label, value }: { label: string; value: any }) => (
    <Box>
        <Typography fontSize={15} color="gray">
            {label}
        </Typography>
        <Typography fontWeight={500}>{value ?? "-"}</Typography>
    </Box>
);
const Building: React.FC = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [viewMode] = useState<"simple" | "detailed">("simple");
    const [object_id, setObject_id] = useState<number | null>(null);
    const { data: objects } = useGetObjectsInfinite();
    const objectList = objects?.pages?.flatMap((p: any) => p.data) ?? [];
    const { data, refetch } = useGetByIdBlockHome(object_id);
    useEffect(() => {
        if (objectList.length > 0) {
            setObject_id(objectList[0].id);
        }
    }, [objectList]);

    useEffect(() => {
        if (object_id) refetch();
    }, [object_id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setObject_id(Number(e.target.value));
    };
    const transformBlocks = (blocks: BlockResponse[]): TransformedBlock[] => {
        return blocks.map((block) => {
            const floors = Object.values(
                block.homes.reduce((acc: Record<number, TransformedFloor>, home) => {
                    const floor = Number(home.stage);

                    if (!acc[floor]) acc[floor] = { floor, homes: [] };

                    acc[floor].homes.push({
                        ...home,
                        status: home.status ?? "available",
                        number_of_rooms: home.number_of_rooms ?? 0,
                        price_repaired: home.price_repaired ?? "",
                    });

                    return acc;
                }, {})
            ).sort((a, b) => b.floor - a.floor);

            return {
                block_id: block.id,
                block_name: block.name,
                floors,
            };
        });
    };

    const uiData: TransformedBlock[] = useMemo(() => {
        if (!data?.blocks) return [];
        return transformBlocks(data.blocks);
    }, [data]);

    const getStatusColor = (status?: string) => {
        if (isDarkMode) {
            const darkBgMap: Record<string, string> = {
                available: "rgba(0, 158, 8, 0.2)",
                sold: "rgba(224, 91, 91, 0.2)",
                reserved: "rgba(255, 162, 81, 0.2)",
                default: "rgba(0, 158, 8, 0.2)",
            };
            return darkBgMap[status ?? "default"];
        } else {
            switch (status) {
                case "available": return "#007A0040";
                case "sold": return "#fca5a5";
                case "reserved": return "#fcd34d";
                default: return "#007A0040";
            }
        }
    };

    const getStatusDotColor = (status?: string) => {
        switch (status) {
            case "available": return "#009E08";
            case "sold": return "#E05B5B";
            case "reserved": return "#FFA251";
            default: return "#009E08";
        }
    };

    const getStatusText = (status?: string) => {
        switch (status) {
            case "available": return "Mavjud";
            case "sold": return "Sotilgan";
            case "reserved": return "Bron";
            default: return "Mavjud";
        }
    };

    const getStatusCounts = (floors: TransformedFloor[]) => {
        const counts = {
            reserved: 0,
            available: 0,
            sold: 0,
            default: 0,
        };
        floors.forEach(({ homes }) => {
            homes.forEach((apt) => {
                const status = apt.status ?? "available";
                if (status === "reserved") counts.reserved++;
                else if (status === "available") counts.available++;
                else if (status === "sold") counts.sold++;
                else counts.default++;
            });
        });
        return counts;
    };

    const getMaxColumns = (floors: TransformedFloor[]) => {
        return Math.max(...floors.map((f) => f.homes.length), 0);
    };
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [home_id, setHomeId] = useState(null);
    const { data: home, refetch: homeRefetch } = useGetByIdHome(home_id)
    const handleOpenDrawer = (item: any) => {
        setHomeId(item.id)
        setOpenDrawer(true);
    }
    const [openModal, setOpenModa] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const handleFullscreen = () => {
        imgRef.current?.requestFullscreen();
    };
    const [active, setActive] = useState("2d");

    const tabs = [
        { key: "2d", label: "2D" },
        { key: "3d", label: "3D" },
    ];
    const handle3d = (home: any) => {
        return () => {
            const currentUrl = window.location.href;
            const tourUrl = `${currentUrl}vizual?tour=true&house=${home.id}&room=0&home_id=${home.id}`;
            // window.open(tourUrl, "_blank");
            window.open(tourUrl);
        }
    }
    useEffect(() => {
        setActive("2d");
    }, [home_id]);
    return (
        <>
            <div className="flex flex-col h-screen w-full">

                <header className="border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
                    <h1 className="text-green-600 text-2xl font-bold">Bino Ko‘rinishi</h1>

                    <div className="flex gap-3 items-center">
                        <TextField
                            size="small"
                            label="Obyekt"
                            select
                            value={object_id ?? ""}
                            onChange={handleChange}
                            sx={{ width: 250 }}
                        >
                            {objectList.map((o: any) => (
                                <MenuItem key={o.id} value={o.id}>
                                    {o.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </header>

                <div className=" flex-1 overflow-hidden">
                    <div className={`flex-1  overflow-y-auto rounded-sm ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                        <div className=" flex flex-wrap xl:grid-cols-4 gap-10 max-w-full px-4">

                            {uiData.map(({ block_id, block_name, floors }) => {
                                const hasHomes = floors?.some(({ homes }) =>
                                    Array.isArray(homes) && homes.some((home) => Boolean(home))
                                );
                                if (!hasHomes) {
                                    return null;
                                }
                                const statusCounts = getStatusCounts(floors);
                                const maxColumns = getMaxColumns(floors);

                                return (
                                    <div
                                        key={block_id}
                                        style={{
                                            backgroundColor: isDarkMode ? "#1B2734" : "#ffffff",
                                            borderColor: isDarkMode ? "#334155" : "#e5e7eb"
                                        }}
                                        className={`rounded-lg p-4 border mt-4  ${isDarkMode ? 'shadow-2xl' : 'shadow-md'}`}
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    bgcolor: "#3b82f6",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    px: 3,
                                                    py: 1,
                                                    "&:hover": {
                                                        bgcolor: "#2563eb",
                                                    },
                                                }}
                                            >
                                                {block_name} Block
                                            </Button>

                                            <div className="flex gap-3 items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFA251" }}></div>
                                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{statusCounts.reserved}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#009E08" }}></div>
                                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{statusCounts.available}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E05B5B" }}></div>
                                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{statusCounts.sold}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-gray-400'}`}></div>
                                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{statusCounts.default}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            style={{ backgroundColor: isDarkMode ? "#0f172a" : "#f9fafb" }}
                                            className="rounded-lg p-3"
                                        >
                                            <div className={`grid gap-2 mb-1.5 pb-1.5 border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`} style={{ gridTemplateColumns: `35px repeat(${maxColumns}, 1fr)` }}>
                                                <div className={`flex items-center justify-center border-r pr-3 ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`}>
                                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={isDarkMode ? 'text-slate-500' : 'text-gray-500'}>
                                                        <path d="M2 14L6 10L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                {Array.from({ length: maxColumns }, (_, i) => i + 1).map((col) => (
                                                    <div
                                                        key={`col-${col}`}
                                                        className={`text-xs font-bold text-center pl-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}
                                                    >
                                                        {col}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {floors.map(({ floor, homes }) => (
                                                    <div
                                                        key={`floor-${floor}`}
                                                        className="grid gap-2"
                                                        style={{ gridTemplateColumns: `35px repeat(${maxColumns}, 1fr)` }}
                                                    >
                                                        <div className={`flex items-center justify-end gap-1 pr-3 border-r ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`}>
                                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={isDarkMode ? 'text-slate-500' : 'text-gray-500'}>
                                                                <path d="M2 14L6 10L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                                                {floor}
                                                            </div>
                                                        </div>

                                                        {Array.from({ length: maxColumns }, (_, i) => {
                                                            const apt = homes[i];
                                                            if (!apt) {
                                                                return (
                                                                    <div
                                                                        key={`empty-${i}`}
                                                                        style={{
                                                                            backgroundColor: isDarkMode ? "#1e293b" : "#f3f4f6"
                                                                        }}
                                                                        className="rounded-md min-h-[53px] pl-3"
                                                                    />
                                                                );
                                                            }

                                                            const status = apt.status ?? "available";
                                                            const dotColor = getStatusDotColor(status);
                                                            const bgColor = getStatusColor(status);

                                                            return (
                                                                <div
                                                                    key={apt.id}
                                                                    style={{
                                                                        backgroundColor: bgColor
                                                                    }}
                                                                    className={`rounded-md min-h-[53px] p-1.5 pl-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10 hover:shadow-lg relative ${status === "sold" ? "opacity-70" : "opacity-100"
                                                                        }`}
                                                                    onClick={() => handleOpenDrawer(apt)}
                                                                >
                                                                    <div
                                                                        className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full"
                                                                        style={{ backgroundColor: dotColor }}
                                                                    ></div>

                                                                    <div className="flex flex-col justify-center h-full" style={{
                                                                        color: status === "available"
                                                                            ? (isDarkMode ? "#ffffff" : "#1f2937")
                                                                            : (isDarkMode ? "#ffffff" : "#1f2937"),
                                                                        fontFamily: "Montserrat, sans-serif"
                                                                    }}>
                                                                        <div className="text-sm font-[500] text-center leading-tight">
                                                                            {apt.number_of_rooms ? `${apt.number_of_rooms}-xona` : ""}
                                                                        </div>
                                                                        <div className="text-sm font-[500] text-center leading-tight mt-0.5">
                                                                            {apt.square ? `${Number(apt.square).toFixed(1)} m²` : ""}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </div>

            </div>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="right">
                <Box sx={{ width: 340, p: 2, overflowY: "auto" }}>
                    <pre>{JSON.stringify(home, null, 2)}</pre>
                </Box>
            </Drawer>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="right">
                {home && (
                    <Box sx={{ width: 340, p: 2, overflowY: "auto" }}>
                        <Typography variant="h6" mb={2}>
                            Uy haqida ma'lumot
                        </Typography>
                        <Typography variant="h6" mb={2}>
                            <Button onClick={() => setOpenModa(true)} variant="outlined" color="primary" fullWidth>Batafsil</Button>
                        </Typography>
                        <div className="relative w-full p-4">

                            <div>
                                {active === "2d" && (
                                    <div className="w-full h-[230px] rounded-md bg-gray-100 flex items-center justify-center">
                                        {home?.plan?.image_one?.url ? (
                                            <img
                                                ref={imgRef}
                                                src={home?.plan?.image_one?.url}
                                                className="w-full h-full rounded-md cursor-pointer object-cover"
                                                onClick={handleFullscreen}
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-sm">Rasm yuklanmadi</p>
                                        )}
                                    </div>
                                )}
                                {active === "3d" && (
                                    <div className="w-full h-[230px] rounded-md bg-gray-100 flex items-center justify-center">
                                        {home?.plan?.document?.url ? (
                                            <img
                                                ref={imgRef}
                                                src={home?.plan?.document?.url}
                                                className="w-full h-full rounded-md cursor-pointer object-cover"
                                                onClick={handleFullscreen}
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-sm">Rasm yuklanmadi</p>
                                        )}
                                    </div>
                                )}

                                {active === "3d-tour" && <div>
                                    <img
                                        ref={imgRef}
                                        src="https://picsum.photos/id/407/1900"
                                        className="w-full h-[230px] rounded-md cursor-pointer"

                                    />
                                </div>}
                            </div>
                            <div className="bg-white w-fit mx-auto shadow-md rounded-full p-1 flex items-center gap-1 mt-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActive(tab.key)}
                                        className={`px-6 py-2 text-sm font-medium rounded-full transition-all
                                                ${active === tab.key
                                                ? "bg-teal-600 text-white shadow-lg"
                                                : "text-gray-700 hover:bg-gray-100"
                                            } `}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                                <button
                                    onClick={handle3d(home)}
                                    className={`px-6 py-2 text-sm font-medium rounded-full transition-all text-gray-700 hover:bg-gray-100`}
                                >
                                    3D tur
                                </button>
                            </div>
                        </div>
                        <Stack spacing={1.3}>
                            <Item label="Uy raqami" value={home.number} />
                            <Item label="Bosqich" value={home.stage} />
                            <Item label="Maydon (m²)" value={home.square} />
                            <Item label="Ta’mirlangan narx" value={utils.currency(home.price_repaired)} />
                            <Item label="Ta’mirsiz narx" value={utils.currency(home.price_no_repaired)} />
                            <Item label="Ta’mirlangan" value={home.is_repaired ? "Ha" : "Yo‘q"} />
                            <Item label="Yashashga tayyor" value={home.is_residential ? "Ha" : "Yo‘q"} />
                            <Item label="Aktiv" value={home.is_active ? "Ha" : "Yo‘q"} />
                        </Stack>

                        <Divider sx={{ my: 2 }} />
                        {home.block && (
                            <>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Blok
                                </Typography>
                                <Item label="Nomi" value={home.block.name} />
                                <Divider sx={{ my: 2 }} />
                            </>
                        )}

                        {home.company && (
                            <>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Kompaniya
                                </Typography>
                                <Item label="Nomi" value={home.company.name} />
                                <Divider sx={{ my: 2 }} />
                            </>
                        )}
                    </Box>

                )}
            </Drawer>
            <Dialog open={openModal} onClose={() => setOpenModa(false)} maxWidth={'lg'}>
                <DialogContent sx={{ minWidth: 12000 }}>


                </DialogContent>
            </Dialog>


        </>
    );
};

export default Building;
