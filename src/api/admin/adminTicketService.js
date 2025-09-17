import http from "@/api/http";

// 🔹 Tüm ticketları getir (admin için)
export async function getAllTickets({ page = 1, limit = 20, status } = {}) {
  const params = { page, limit };
  if (status) params.status = status;

  const res = await http.get("/admin/tickets", { params });
  return res.data; 
  // backend'ten { total, tickets, currentPage, totalPages } gelecek şekilde tasarlarsın
}

// 🔹 Ticket durumunu güncelle
export async function updateTicketStatus(id, status) {
  const res = await http.patch(`/admin/tickets/${id}/status`, { status });
  return res.data;
}

// 🔹 Ticket sil (opsiyonel)
export async function deleteTicket(id) {
  const res = await http.delete(`/admin/tickets/${id}`);
  return res.data;
}
