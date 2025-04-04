import { Fragment, memo } from "react";

// img
import LoaderGif from "/assets/images/logo.png";

const Loader = memo(() => {
  return (
    <Fragment>
      <div className="loader simple-loader animate__animated">
        <div className="loader-body">
          <img
            src={LoaderGif}
            alt="Leikapui"
            className="img-fluid animate-pulse"
            width="200"
          />
        </div>
      </div>
    </Fragment>
  );
});

Loader.displayName = "Loader";
export default Loader;
