"use client";
import "bootstrap/dist/css/bootstrap.min.css";  
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const regions = [
  "Toshkent", "Samarqand", "Buxoro", "Xorazm", "Surxondaryo", "Qashqadaryo", 
  "Jizzax", "Sirdaryo", "Farg‘ona", "Andijon", "Namangan", "Navoiy", "Qoraqalpog‘iston"
];

interface Ticket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
}

export default function AdminPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [formData, setFormData] = useState<Omit<Ticket, "id">>({ from: "", to: "", date: "", time: "", price: 0 });

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    const { data, error } = await supabase.from("tickets").select("*");
    if (error) console.error("Error fetching tickets:", error);
    else setTickets(data as Ticket[]);
  }

  async function addTicket(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("tickets").insert([formData]);
    if (error) console.error("Error adding ticket:", error);
    else {
      fetchTickets();
      setFormData({ from: "", to: "", date: "", time: "", price: 0 });
    }
  }

  async function deleteTicket(id: string) {
    const { error } = await supabase.from("tickets").delete().eq("id", id);
    if (error) console.error("Error deleting ticket:", error);
    else fetchTickets();
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Panel</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Ticket</h5>
          <form onSubmit={addTicket}>
            <div className="mb-3">
              <label className="form-label">From</label>
              <select className="form-select" value={formData.from} onChange={(e) => setFormData({ ...formData, from: e.target.value })} required>
                <option value="">Select a city</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">To</label>
              <select className="form-select" value={formData.to} onChange={(e) => setFormData({ ...formData, to: e.target.value })} required>
                <option value="">Select a city</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Time</label>
                <input type="time" className="form-control" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input type="number" className="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required />
            </div>

            <button type="submit" className="btn btn-primary w-100">Add Ticket</button>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.from}</td>
                <td>{ticket.to}</td>
                <td>{ticket.date}</td>
                <td>{ticket.time}</td>
                <td>${ticket.price}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteTicket(ticket.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
