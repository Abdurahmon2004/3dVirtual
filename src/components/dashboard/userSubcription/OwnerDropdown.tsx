import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    TextField,
    InputAdornment,
    CircularProgress,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    Popper,
    ClickAwayListener,
} from "@mui/material";
import { Search, KeyboardArrowDown } from "@mui/icons-material";
import { useGetUsers } from "@/hooks/modules/users";

// 🔹 Backend dan kelayotgan to'liq Owner interfeysi
interface Owner {
    id: number;
    name: string;
    phone: string;
    status: number;
    company: string;
    login: string;
    created_at?: string;
    email_verified_at?: string | null;
    is_admin?: number;
    is_owner?: number;
    email?: string;
    updated_at?: string;
    // Boshqa fieldlar ham bo'lishi mumkin - kerak bo'lsa qo'shing
}

interface UsersDropdownProps {
    // Tanlangan foydalanuvchini ota komponentga qaytarish uchun
    onSelect: (user: Owner | null) => void;
    // Boshlang'ich qiymat (agar mavjud bo'lsa)
    defaultValue?: Owner | null;
    // Placeholder matni
    placeholder?: string;
}

const UsersDropdown: React.FC<UsersDropdownProps> = ({
    onSelect,
    defaultValue = null,
    placeholder = "Foydalanuvchi tanlang...",
}) => {
    // 🔹 Holatlar
    const [search, setSearch] = useState(""); // Qidiruv matni
    const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced qidiruv
    const [page, setPage] = useState(1); // Joriy sahifa
    const [allUsers, setAllUsers] = useState<Owner[]>([]); // Barcha yuklangan foydalanuvchilar
    const [selectedUser, setSelectedUser] = useState<Owner | null>(defaultValue); // Tanlangan foydalanuvchi
    const [open, setOpen] = useState(false); // Dropdown ochiq/yopiq holati
    const [hasMore, setHasMore] = useState(true); // Yana ma'lumot bormi

    // 🔹 Refs
    const anchorRef = useRef<HTMLDivElement>(null); // Dropdown pozitsiyasi uchun
    const listRef = useRef<HTMLDivElement>(null); // Scroll uchun

    const limit = 10; // Har safar 10 ta element yuklanadi

    // 🔹 Qidiruv uchun debounce (400ms kutib so'rov yuboradi)
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Qidiruv o'zgarganda sahifani qayta boshlash
            setAllUsers([]); // Avvalgi natijalarni tozalash
        }, 400);
        return () => clearTimeout(delay);
    }, [search]);

    // 🔹 Foydalanuvchilarni backend dan olish
    const { data: ownersResponse, isLoading } = useGetUsers({
        page,
        limit,
        search: debouncedSearch,
    });

    // 🔹 Yangi ma'lumotlar kelganda ro'yxatga qo'shish
    useEffect(() => {
        if (ownersResponse?.data) {
            const newUsers = ownersResponse.data;

            // Agar qidiruv yangilangan bo'lsa, eski ma'lumotlarni almashtirish
            if (page === 1) {
                setAllUsers(newUsers);
            } else {
                // Aks holda, yangi ma'lumotlarni qo'shish (infinite scroll)
                setAllUsers((prev) => [...prev, ...newUsers]);
            }

            // Agar kamroq element qaytgan bo'lsa, boshqa sahifa yo'q
            setHasMore(newUsers.length === limit);
        }
    }, [ownersResponse, page]);

    // 🔹 Scroll yetganda keyingi sahifani yuklash
    const handleScroll = () => {
        if (!listRef.current || isLoading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = listRef.current;

        // Scroll pastga yetganini tekshirish (10px dan kam qolganda yuklash)
        if (scrollHeight - scrollTop <= clientHeight + 10) {
            setPage((prev) => prev + 1);
        }
    };

    // 🔹 Foydalanuvchini tanlash
    const handleSelectUser = (user: Owner) => {
        setSelectedUser(user);
        onSelect(user); // Ota komponentga yuborish
        setOpen(false); // Dropdown ni yopish
    };

    // 🔹 Tanlovni bekor qilish
    const handleClearSelection = () => {
        setSelectedUser(null);
        onSelect(null);
    };

    // 🔹 Dropdown ni ochish/yopish
    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    // 🔹 Dropdown tashqarisiga bosilganda yopish
    const handleClickAway = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
                {/* 🔹 Asosiy input maydoni */}
                <Box
                    ref={anchorRef}
                    onClick={handleToggle}
                    sx={{
                        border: "1px solid #d1d5db",
                        borderRadius: 2,
                        padding: "10px 14px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "white",
                        "&:hover": {
                            borderColor: "#9ca3af",
                        },
                    }}
                >
                    {selectedUser ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <span style={{ fontWeight: 500 }}>{selectedUser.name}</span>
                            <Chip
                                label={selectedUser.company}
                                size="small"
                                sx={{ fontSize: "0.75rem" }}
                            />
                        </Box>
                    ) : (
                        <span style={{ color: "#9ca3af" }}>{placeholder}</span>
                    )}
                    <KeyboardArrowDown
                        sx={{
                            color: "#6b7280",
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                        }}
                    />
                </Box>

                {/* 🔹 Dropdown menyusi */}
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 1,
                            borderRadius: 2,
                            maxHeight: 400,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* 🔹 Qidiruv maydoni */}
                        {/* <Box  p={1.5} borderBottom="1px solid #e5e7eb">
                            <TextField
                                placeholder="Qidirish..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                fullWidth
                                size="small"
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                onClick={(e) => e.stopPropagation()} // Input bosilganda dropdown yopilmasligi uchun
                            />
                        </Box> */}

                        {/* 🔹 Ro'yxat (Scroll bilan) */}
                        <Box
                            ref={listRef}
                            onScroll={handleScroll}
                            sx={{
                                maxHeight: 300,
                                overflowY: "auto",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "#d1d5db",
                                    borderRadius: "3px",
                                },
                            }}
                        >
                            <List disablePadding>
                                {allUsers.map((user) => (
                                    <ListItem key={user.id} disablePadding>
                                        <ListItemButton
                                            onClick={() => handleSelectUser(user)}
                                            selected={selectedUser?.id === user.id}
                                            sx={{
                                                "&.Mui-selected": {
                                                    bgcolor: "rgba(59, 130, 246, 0.1)",
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box component="span" fontSize="0.8rem" color="text.secondary">
                                                        {user.company} • {user.phone}
                                                    </Box>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}

                                {/* 🔹 Yuklanish indikatori */}
                                {isLoading && (
                                    <Box textAlign="center" py={2}>
                                        <CircularProgress size={24} />
                                    </Box>
                                )}

                                {/* 🔹 Ma'lumot topilmadi */}
                                {!isLoading && allUsers.length === 0 && (
                                    <Box textAlign="center" py={3} color="text.secondary">
                                        Ma'lumot topilmadi
                                    </Box>
                                )}
                            </List>
                        </Box>
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
};

export default UsersDropdown;