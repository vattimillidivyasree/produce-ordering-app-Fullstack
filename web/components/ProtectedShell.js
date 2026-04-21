import Navbar from "./Navbar";

export default function ProtectedShell({ children }) {
  return (
    <div className="container">
      <Navbar />
      {children}
    </div>
  );
}
