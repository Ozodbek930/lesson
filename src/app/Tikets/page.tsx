"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface Ticket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [formData, setFormData] = useState<Omit<Ticket, "id">>({
    from: "",
    to: "",
    date: "",
    time: "",
    price: 0,
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    const { data, error } = await supabase.from("tickets").select("*");
    if (error) console.error("Error fetching tickets:", error);
    else setTickets(data as Ticket[]);
  }


  async function deleteTicket(id: string) {
    const { error } = await supabase.from("tickets").delete().eq("id", id);
    if (error) console.error("Error deleting ticket:", error);
    else fetchTickets();
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Tickets</h2>

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
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTicket(ticket.id)}
                  >
                    Delete
                  </button>
                  <button className="btn btn-success btn-sm">Buy Ticket</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
