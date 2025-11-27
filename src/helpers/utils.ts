import Swal, { SweetAlertIcon } from "sweetalert2";

export default {
    alert(icon: SweetAlertIcon = "success", title = "Amaliyot bajarildi !") {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            customClass: {
                container: 'my-toast-container'
            },
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
        return Toast.fire({
            icon,
            title,
        });
    },
    formData(data: Record<string, any>): FormData {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (value instanceof FileList) {
                Array.from(value).forEach((file) => formData.append(key, file));
                return;
            }
            if (value instanceof File) {
                formData.append(key, value);
                return;
            }
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    if (v instanceof File || v instanceof Blob) {
                        formData.append(`${key}[]`, v);
                    } else {
                        formData.append(`${key}[]`, String(v));
                    }
                });
                return;
            }
            if (typeof value === "object") {
                if (Object.keys(value).length === 0) return;
                formData.append(key, JSON.stringify(value));
                return;
            }
            formData.append(key, String(value));
        });

        return formData;
    },
    currency(amount: number, locale = "uz-UZ", currency = "UZS"): string {
        const formatted = new Intl.NumberFormat(locale, {
            maximumFractionDigits: 0
        }).format(amount);

        return `${formatted} ${currency}`;
    }


}