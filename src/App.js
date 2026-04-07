import AppRouter from "./router/AppRouter";
<<<<<<< HEAD
import "./App.css";

function App() {
  return <AppRouter />;
}

export default App;
=======
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default App;
>>>>>>> d89c09939460a2e95c5c466d7a36e4eddc324b7a
