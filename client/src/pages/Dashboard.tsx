import { Search, Bell, ChevronDown, Calendar, Plus, Download, Filter, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const orders = [
  { id: 1, partyName: "Friends Club", orderId: "OR-0012000D", receivedDate: "20.09.2025", receivedTime: "10:30 AM", dispatchDate: "30.10.2025", status: "Delivered" },
  { id: 2, partyName: "Kishor Kumar", orderId: "OR-0012000D", receivedDate: "20.09.2025", receivedTime: "10:30 AM", dispatchDate: "30.10.2025", status: "Pending" },
  { id: 3, partyName: "Kishor Kumar", orderId: "OR-0012000D", receivedDate: "20.09.2025", receivedTime: "10:30 AM", dispatchDate: "30.10.2025", status: "Pending" },
  { id: 4, partyName: "Rockers Club", orderId: "OR-0012000D", receivedDate: "20.09.2025", receivedTime: "10:30 AM", dispatchDate: "30.10.2025", status: "Delivered" },
  { id: 5, partyName: "Kishor Kumar", orderId: "OR-0012000D", receivedDate: "20.09.2025", receivedTime: "10:30 AM", dispatchDate: "30.10.2025", status: "Pending" },
  { id: 6, partyName: "Rockers Club", orderId: "OR-0012000D", receivedDate: "20.09.2025", receivedTime: "10:30 AM", dispatchDate: "30.10.2025", status: "Delivered" },
  { id: 7, partyName: "Kishor Kumar", orderId: "OR-0012000D", receivedDate: "20.09.2025", receivedTime: "10:30 AM", dispatchDate: "30.10.2025", status: "Pending" },
  { id: 8, partyName: "Kishor Kumar", orderId: "OR-0012000D", receivedDate: "20.09.2025", receivedTime: "10:30 AM", dispatchDate: "30.10.2025", status: "Pending" },
];

const statsCards = [
  { title: "Total Orders", value: "50", bgColor: "bg-blue-100", iconColor: "text-blue-600" },
  { title: "Completed", value: "32", bgColor: "bg-green-100", iconColor: "text-green-600" },
  { title: "Processed", value: "10", bgColor: "bg-purple-100", iconColor: "text-purple-600" },
  { title: "Processing", value: "2", bgColor: "bg-orange-100", iconColor: "text-orange-600" },
  { title: "On Hold", value: "2", bgColor: "bg-red-100", iconColor: "text-red-600" },
  { title: "Que", value: "1", bgColor: "bg-yellow-100", iconColor: "text-yellow-600" },
];

const sidebarItems = [
  { name: "Dashboard", icon: "📊", active: true },
  { name: "Orders", icon: "📦", active: false },
  { name: "Orders Que", icon: "📋", active: false },
  { name: "Missing Orders", icon: "⚠️", active: false },
  { name: "Dispatch Dates", icon: "📅", active: false },
];

const sidebarBottomItems = [
  { name: "Reports", icon: "📈" },
  { name: "Attributes", icon: "⚙️" },
];

export function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f4f8ff]">
      {/* Sidebar */}
      <aside className="w-60 bg-white flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 flex justify-center">
          <div className="text-2xl font-bold text-blue-600">TRIBAL</div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 mt-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors ${
                  item.active
                    ? "bg-[#0057ff] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-semibold text-sm">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200" />

          {/* Bottom Navigation */}
          <div className="space-y-2">
            {sidebarBottomItems.map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-semibold text-sm">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-lg">⚙️</span>
            <span className="font-semibold text-sm">Settings</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-lg">🚪</span>
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-60">
        {/* Header */}
        <header className="bg-white h-[70px] flex items-center justify-between px-8 sticky top-0 z-10">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-5">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                6
              </span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gray-300 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-700">Pradeep</p>
                <p className="text-xs text-gray-500 font-semibold">Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Hi, Pradeep</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6">
                {/* From Date */}
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-4 py-2.5 w-56">
                  <span className="text-sm text-gray-700">From Date</span>
                  <Calendar className="w-4 h-4 text-gray-500 ml-auto" />
                </div>
                {/* To Date */}
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-4 py-2.5 w-56">
                  <span className="text-sm text-gray-700">To Date</span>
                  <Calendar className="w-4 h-4 text-gray-500 ml-auto" />
                </div>
                {/* Apply Button */}
                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 px-8">
                  Apply
                </Button>
              </div>
              {/* Add New Order */}
              <Button className="bg-[#4880ff] hover:bg-[#3a6fe0] text-white px-6">
                <Plus className="w-4 h-4 mr-2" />
                Add New Order
              </Button>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6" />

          {/* Stats Cards */}
          <div className="grid grid-cols-6 gap-6 mb-6">
            {statsCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold opacity-70 mb-4">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                  </div>
                  <div className={`w-14 h-14 ${card.bgColor} rounded-full flex items-center justify-center`}>
                    <span className={`text-xl ${card.iconColor}`}>📦</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Table Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Input
                    placeholder="Search"
                    className="w-72 bg-gray-100 border-none pl-4 pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Filter Icon */}
                <button className="p-2.5 bg-gray-100 rounded hover:bg-gray-200">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>

                {/* Grid Icon */}
                <button className="p-2.5 bg-gray-100 rounded hover:bg-gray-200">
                  <LayoutGrid className="w-5 h-5 text-gray-600" />
                </button>

                {/* All Dropdown */}
                <button className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded text-gray-600 hover:bg-gray-200">
                  <span className="text-sm">All</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Date Range Dropdown */}
                <button className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded text-gray-600 hover:bg-gray-200">
                  <span className="text-sm">Filter by date range</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Export Button */}
                <Button className="bg-[#4880ff] hover:bg-[#3a6fe0] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#ebf3ff] rounded-xl">
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-800 rounded-l-xl">Party Name</th>
                    <th className="text-center py-4 px-6 font-bold text-sm text-gray-800">Order-ID</th>
                    <th className="text-center py-4 px-6 font-bold text-sm text-gray-800">Received Date</th>
                    <th className="text-center py-4 px-6 font-bold text-sm text-gray-800">Received Time</th>
                    <th className="text-center py-4 px-6 font-bold text-sm text-gray-800">Dispatch Date</th>
                    <th className="text-center py-4 px-6 font-bold text-sm text-gray-800 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-700 font-semibold opacity-80">{order.partyName}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-semibold opacity-80 text-center">{order.orderId}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-semibold opacity-80 text-center">{order.receivedDate}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-semibold opacity-80 text-center">{order.receivedTime}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-semibold opacity-80 text-center">{order.dispatchDate}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-sm font-bold text-white ${
                            order.status === "Delivered"
                              ? "bg-[#16b355]"
                              : "bg-[#d9a645]"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
