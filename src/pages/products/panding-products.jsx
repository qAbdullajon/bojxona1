import React, { useEffect, useState } from "react";
import GlobalTable from "../../components/global-table";
import $api from "../../http/api";
import { format } from "date-fns";
import { ArrowRightFromLine, Check, CircleCheck } from "lucide-react";
import NoData from "../../assets/no-data.png";
import { Box, Dialog, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProductStore } from "../../hooks/useModalState";
import { notification } from "../../components/notification";

export default function PandingProducts() {
  const { createData } = useProductStore();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const navigation = useNavigate();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    currentPage: 1,
  });

  const columns = [
    { field: "id", headerName: "№" },
    { field: "name", headerName: "Mahsulot nomi" },
    { field: "price", headerName: "Narxi" },
    { field: "createdAt", headerName: "Qo‘shilgan sana" },
    { field: "action", headerName: "Tasdiqlash" },
  ];
  const onClose = () => {
    setProduct(null);
    setOpen(false);
  };
  const onOpen = (row) => {
    setOpen(true);
    setProduct(row);
    createData({ ...row, statusProduct: {product_status: "Saqlovda"} });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await $api.get(
          "/products/get/access?access_product=false",
          {
            params: {
              page: pagination.currentPage,
              limit: pagination.rowsPerPage,
              search: search,
            },
          }
        );
        setData(res.data.productData);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Xatolik yuz berdi:", error);
      }
    };

    fetchData();
  }, [pagination.currentPage, pagination.rowsPerPage, search]);

  const updateAccess = async () => {
    try {
      const res = await $api.patch(`products/update/${product.id}`, {
        statusId: "01f8dafe-c399-4d04-9814-31b572e95f0d",
        access_product: true,
      });
      if (res.status === 200) {
        setOpen(false);
        navigation("/maxsulotlar");
      }
    } catch (error) {
      notification(error.response?.data?.message)
    }
  };

  const formattedRows = data.map((row, index) => ({
    ...row,
    id: index + 1,
    createdAt: format(new Date(row.createdAt), "dd-MM-yyyy"),
    action: (
      <div className="flex gap-4">
        <button
          onClick={() => onOpen(row)}
          className="border border-gray-500 rounded-full p-1 cursor-pointer"
        >
          <Check size={17} />
        </button>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-400 cursor-pointer"
          onClick={() => navigate(`/maxsulotlar/${row.id}`)}
        >
          <ArrowRightFromLine size={16} />
        </button>
      </div>
    ),
  }));

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
      currentPage: newPage + 1,
    }));
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setPagination({
      page: 0,
      rowsPerPage: newRowsPerPage,
      currentPage: 1,
    });
  };

  return (
    <div className="p-4">
      {total === 0 ? (
        <Box textAlign="center" py={10}>
          <Box
            component="img"
            src={NoData}
            alt="No data"
            sx={{ width: 128, height: 128, margin: "0 auto", mb: 2 }}
          />
          <Typography variant="body1" color="text.secondary">
            Ma'lumotlar topilmadi
          </Typography>
        </Box>
      ) : (
        <GlobalTable
          columns={columns}
          rows={formattedRows}
          page={pagination.page}
          rowsPerPage={pagination.rowsPerPage}
          total={total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}

      <Dialog open={open} onClose={onClose}>
        <div className="w-[400px] flex flex-col items-center p-4">
          <CircleCheck size={48} color="green" />
          <p className="text-center text-2xl pt-4">
            Siz mahsulotni tasdiqlamochimisiz?
          </p>

          <button
            onClick={updateAccess}
            className="w-full bg-[green] text-white py-2 rounded-md mt-4 cursor-pointer"
          >
            Ha
          </button>
        </div>
      </Dialog>
    </div>
  );
}
