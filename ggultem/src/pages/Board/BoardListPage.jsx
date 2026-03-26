import "./BoardListPage.css";
import BoardList from "../../components/Board/BoardListComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";

const BoardListPage = () => {
  return (
    <div className="boardList-page-wrapper">
      <Header />
      <main className="boardList-main-content">
        <BoardList />
      </main>
      <Footer />
    </div>
  );
};

export default BoardListPage;
