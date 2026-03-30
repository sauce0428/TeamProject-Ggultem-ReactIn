import ListComponent from "../../../components/admin/Notice/ListComponent";

const ListPage = () => {
  return (
    <div className="notice-page-wrapper">
      <Header />
      <main className="notice-main-content">
        <ListComponent />
      </main>
      <Footer />
    </div>
  );
};
export default ListPage;
