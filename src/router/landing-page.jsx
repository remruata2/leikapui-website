import { lazy } from "react";
// layout
import FrontendLayout from "../layouts/FrontendLayout";
import BlankLayout from "../layouts/BlankLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// account pages
const Profile = lazy(() => import("../views/Account/Profile"));
const Devices = lazy(() => import("../views/Account/Devices"));
const Purchases = lazy(() => import("../views/Account/Purchases"));

// pages
const OTTPage = lazy(() => import("../views/MainPages/OTTPage"));

// tv-shows pages
const TvShowsList = lazy(() => import("../views/MainPages/TvShowsPage"));
const TvShowsDetail = lazy(() => import("../views/TvShows/DetailPage"));
const LatestEpisodes = lazy(() => import("../views/TvShows/EpisodePage"));

// movies pages
const MoviePage = lazy(() => import("../views/MainPages/MoviesPage"));
const MovieDetail = lazy(() => import("../views/Movies/DetailPage"));

// videos pages
const VideoList = lazy(() => import("../views/MainPages/VideosPage"));

// genre pages
const Playlist = lazy(() => import("../views/Playlist"));
const GenresPage = lazy(() => import("../views/GenresPage"));

//tag pages
const TagsPage = lazy(() => import("../views/TagsPage"));

// cast pages
const CastList = lazy(() => import("../views/Cast/ListPage"));
const DetailPage = lazy(() => import("../views/Cast/DetailPage"));
const CastViewAll = lazy(() => import("../views/Cast/ViewAll"));

// blog pages
const BlogList = lazy(() => import("../views/BlogPages/ListPage"));
const BlogDetail = lazy(() => import("../views/BlogPages/DetailPage"));
const BlogGrid = lazy(() => import("../views/BlogPages/GridList"));
const Blogtemplate = lazy(() => import("../views/BlogPages/Blogtemplate"));
const BlogSingle = lazy(() => import("../views/BlogPages/BlogSingle"));
const SidebarList = lazy(() => import("../views/BlogPages/SidebarListPage"));

// extra pages
const AboutPage = lazy(() => import("../views/ExtraPages/AboutPage"));
const ContactPage = lazy(() => import("../views/ExtraPages/ContactUs"));
const FAQPage = lazy(() => import("../views/ExtraPages/FAQPage"));
const PrivacyPolicy = lazy(() => import("../views/ExtraPages/PrivacyPolicy"));
const TermsofUse = lazy(() => import("../views/ExtraPages/TermsofUse"));
const CancellationRefund = lazy(() =>
  import("../views/ExtraPages/CancellationRefund")
);
const PricingPage = lazy(() => import("../views/PricingPage"));
const ErrorPage1 = lazy(() => import("../views/ExtraPages/ErrorPage1"));
const ErrorPage2 = lazy(() => import("../views/ExtraPages/ErrorPage2"));

//login pages
const LoginPage = lazy(() => import("../views/AuthPages/LoginPage"));
const SignUpPage = lazy(() => import("../views/AuthPages/SignUpPage"));
const LostPassword = lazy(() => import("../views/AuthPages/LostPassword"));

// merchandise pages
const IndexPage = lazy(() => import("../views/MerchandisePages/IndexPage"));
const ShopCategoryPage = lazy(() =>
  import("../views/MerchandisePages/ShopCategoryPage")
);
const CartPage = lazy(() => import("../views/MerchandisePages/CartPage"));
const CheckOutPage = lazy(() =>
  import("../views/MerchandisePages/CheckoutPage")
);
const WishlistPage = lazy(() =>
  import("../views/MerchandisePages/WishlistPage")
);
const TrackOrder = lazy(() => import("../views/MerchandisePages/TrackOrder"));
const MyAccount = lazy(() => import("../views/MerchandisePages/my-account"));

// view all page
const ViewAll = lazy(() => import("../views/ViewAll"));
const CommingSoonPage = lazy(() =>
  import("../views/ExtraPages/CommingSoonPage")
);
const HomePage = lazy(() => import("../views/MainPages/IndexPage"));
const RestrictedPage = lazy(() => import("../views/Movies/RestictedPage"));
const RelatedMerchandisePage = lazy(() =>
  import("../views/Movies/RelatedMerchandiesPage")
);
const VideoDetail = lazy(() => import("../views/VideosPage/DetailPage"));
const ProductDetail = lazy(() =>
  import("../views/MerchandisePages/ProductDetailPage")
);
const WatchlistDetail = lazy(() => import("../views/WatchlistDetail"));
const AllGenres = lazy(() => import("../views/AllGenres"));
const AllProduct = lazy(() => import("../views/MerchandisePages/AllProduct"));

export const LandingpageRouter = [
  {
    path: "/",
    element: <FrontendLayout HeaderMega="true" FooterCompact="true" />,
    children: [
      {
        path: "",
        element: <OTTPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/movies",
        element: (
          <ProtectedRoute>
            <MoviePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/movies-detail/:id",
        element: (
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tv-shows",
        element: (
          <ProtectedRoute>
            <TvShowsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/shows-details/:id",
        element: (
          <ProtectedRoute>
            <TvShowsDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/episodes",
        element: (
          <ProtectedRoute>
            <LatestEpisodes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/videos",
        element: (
          <ProtectedRoute>
            <VideoList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/videos-detail",
        element: (
          <ProtectedRoute>
            <VideoDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/restricted-content",
        element: (
          <ProtectedRoute>
            <RestrictedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/related-merchandise",
        element: (
          <ProtectedRoute>
            <RelatedMerchandisePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/playlist",
        element: (
          <ProtectedRoute>
            <Playlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "/watchlist-detail",
        element: (
          <ProtectedRoute>
            <WatchlistDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/geners",
        element: (
          <ProtectedRoute>
            <GenresPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/all-genres",
        element: (
          <ProtectedRoute>
            <AllGenres />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tags",
        element: (
          <ProtectedRoute>
            <TagsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cast",
        element: (
          <ProtectedRoute>
            <CastList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cast-detail",
        element: (
          <ProtectedRoute>
            <DetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cast-view-all",
        element: (
          <ProtectedRoute>
            <CastViewAll />
          </ProtectedRoute>
        ),
      },
      {
        path: "/blogs",
        element: <BlogList title="blogs.blog_listing" />,
      },
      {
        path: "/blogs-tag",
        element: <BlogList title="blogs.comedy" />,
      },
      {
        path: "/blogs-category",
        element: <BlogList title="blogs.drama" />,
      },
      {
        path: "/blogs-date",
        element: <BlogList title="Day: September 23, 2022" />,
      },
      {
        path: "/blogs-author",
        element: <BlogList title="Author: Goldenmace" />,
      },
      {
        path: "/blogs/:grid",
        element: <BlogGrid />,
      },
      {
        path: "/blogs-sidebar/:position",
        element: <SidebarList />,
      },
      {
        path: "/blogs-detail",
        element: <BlogDetail />,
      },
      {
        path: "/blog-template",
        element: <Blogtemplate />,
      },
      {
        path: "/blog-single/:type",
        element: <BlogSingle />,
      },
      {
        path: "/about-us",
        element: <AboutPage />,
      },
      {
        path: "/contact-us",
        element: <ContactPage />,
      },
      {
        path: "/faq",
        element: <FAQPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-of-use",
        element: <TermsofUse />,
      },
      {
        path: "/cancellation-refund",
        element: <CancellationRefund />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/view-all",
        element: (
          <ProtectedRoute>
            <ViewAll />
          </ProtectedRoute>
        ),
      },
      {
        path: "/all-products",
        element: (
          <ProtectedRoute>
            <AllProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/product-detail",
        element: (
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/devices",
        element: (
          <ProtectedRoute>
            <Devices />
          </ProtectedRoute>
        ),
      },
      {
        path: "/purchases",
        element: (
          <ProtectedRoute>
            <Purchases />
          </ProtectedRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: <CheckOutPage />,
      },
      {
        path: "/wishlist",
        element: <WishlistPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/track-order",
        element: <TrackOrder />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <FrontendLayout HeaderMerchandise="true" FooterMerchandise="true" />
    ),
    children: [
      {
        path: "/merchandise-store",
        element: <IndexPage />,
      },
    ],
  },
  {
    path: "/",
    element: <FrontendLayout HeaderMerchandise="true" FooterCompact="true" />,
    children: [
      {
        path: "/shop",
        element: <ShopCategoryPage />,
      },
    ],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      {
        path: "/coming-soon",
        element: <CommingSoonPage />,
      },
      {
        path: "/error-page-one",
        element: <ErrorPage1 />,
      },
      {
        path: "/error-page-two",
        element: <ErrorPage2 />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <SignUpPage />,
      },
      {
        path: "/lost-password",
        element: <LostPassword />,
      },
    ],
  },
];
