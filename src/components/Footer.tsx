import '../assets/css/footer.css';

export const Footer = (): JSX.Element => {
return (
    <footer className="footer">
      <div
        className="wrapper tw-flex tw-items-center tw-justify-center tw-text-center tw-text-sm"
      >
        <span>
          For more info or suggestions, visit the project page on&nbsp;
          <a href="https://github.com/MrIee/react-movie-quiz" target="_blank">github</a>
        </span>
      </div>
    </footer>
  )
};
