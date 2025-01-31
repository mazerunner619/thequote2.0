import { SiInstagram } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="text-center text-white">
      <div className="footer">
        ©mazerunner619{"  "}
        <a
          href="https://www.instagram.com/happiest_depressed_1/"
          style={{ color: "white", fontSize: "20px" }}
        >
          {" "}
          <SiInstagram />{" "}
        </a>
      </div>
    </footer>
  );
}
