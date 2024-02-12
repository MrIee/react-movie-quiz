// import { useState } from 'react';
import { Link } from 'react-router-dom';
// import clsx from 'clsx';
import '../assets/css/topbar.css';

// !======================= README ========================
// Commented out several lines of code for implementing a mobile menu in the future
// !=======================================================

export const Topbar = ({ title = '', }): JSX.Element => {
  // const [isExpanded, setIsExpanded] = useState(false);

  // const toggleIsExpanded = (): void => {
  //   setIsExpanded((currentIsExpanded: boolean): boolean => {
  //     return !currentIsExpanded;
  //   })
  // };

  return (
    <nav className="topbar">
      <div className="wrapper tw-flex tw-items-center tw-flex-wrap tw-px-3">
        {/* <a className="topbar__nav-icon-wrapper" onClick={toggleIsExpanded}>
          <span className="topbar__nav-icon"></span>
        </a> */}
        <h2 className="tw-text-base sm:tw-text-xl tw-mr-6">
          {/* <Link to="/" onClick={() =>  setIsExpanded(false)}>{title}</Link> */}
          <Link to="/">{title}</Link>
        </h2>
        {/* <div
          className={
            clsx(
              'topbar__nav',
              isExpanded && 'topbar_nav--expanded'
            )}
        >
          <ul className="topbar__nav-menu">
            <li></li>
          </ul>
        </div> */}
        <a
          className="sm:tw-hidden tw-ml-auto"
          href="https://github.com/MrIee/react-movie-quiz"
          target="_blank"
        >
          Github
        </a>
      </div>
    </nav>
  );
};
