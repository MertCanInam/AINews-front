import http from "./http";


// Kullanıcı yeni ticket oluşturur
export const createTicket = (payload) => http.post("/tickets", payload);

// Kullanıcı kendi ticketlarını görür
export const getMyTickets = () => http.get("/tickets/my");

// Admin tüm ticketları görür
export const getAllTickets = (params) => http.get("/tickets", { params });

// Tek ticket detay
export const getTicketById = (id) => http.get(`/tickets/${id}`);

// Admin ticket durumunu günceller
export const updateTicketStatus = (id, status) =>
  http.put(`/tickets/${id}/status`, { status }); // "open" | "read" | "closed"

// Admin ticket siler
export const deleteTicket = (id) => http.delete(`/tickets/${id}`);
