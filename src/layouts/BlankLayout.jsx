import { Fragment, Suspense } from "react";

// reacr-router
import { Outlet } from "react-router-dom";

import Loader from "../components/Loader";

const BlankLayout = () => {
  return (
    <Fragment>
      <Suspense fallback={<Loader></Loader>}>
        <Outlet></Outlet>
      </Suspense>
    </Fragment>
  );
};
export default BlankLayout;
