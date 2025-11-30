import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, XCircle, Clock } from "lucide-react";

export default function OrdersDashboard() {
  const orders = [
    { id: "#123245", date: "14-12-2020", name: "Decorative box", price: "125 USD", status: "Delivered" },
    { id: "#678457", date: "13-12-2020", name: "Plantation box", price: "120 USD", status: "Cancelled" },
    { id: "#123245", date: "12-12-2020", name: "Camera film", price: "156 USD", status: "Delivered" },
    { id: "#873245", date: "10-12-2020", name: "Visualtace", price: "125 USD", status: "Delivered" },
    { id: "#273245", date: "11-11-2020", name: "Decorative box", price: "180 USD", status: "Pending" },
    { id: "#879245", date: "10-11-2020", name: "Decorative box", price: "190 USD", status: "Delivered" },
  ];

  const statusColor = (status) => {
    if (status === "Delivered") return "text-green-500";
    if (status === "Cancelled") return "text-red-500";
    return "text-yellow-500";
  };

  const statusIcon = (status) => {
    if (status === "Delivered") return <BadgeCheck className="w-4 h-4 text-green-500" />;
    if (status === "Cancelled") return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="w-full p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">Orders <span>😍</span></h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <p className="text-slate-600">New Orders</p>
            <h2 className="text-3xl font-semibold">245</h2>
            <p className="text-sm text-blue-500 mt-1">Impression - 20%</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <p className="text-slate-600">Pending Orders</p>
            <h2 className="text-3xl font-semibold">123</h2>
            <p className="text-sm text-purple-500 mt-1">Impression - 11%</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <p className="text-slate-600">Delivered Orders</p>
            <h2 className="text-3xl font-semibold">150</h2>
            <p className="text-sm text-orange-500 mt-1">Impression - 18%</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-slate-600 border-b">
              <th className="p-3">Order ID</th>
              <th className="p-3">Ordered Date</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Product Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b hover:bg-slate-50 transition">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.price}</td>
                <td className="p-3 flex items-center gap-2">
                  {statusIcon(order.status)}
                  <span className={statusColor(order.status)}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
