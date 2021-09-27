import * as React from 'react';

const Footer: React.FC = () => {
  return (
    <>
      <footer>
        <p>
          Copyright {new Date().getFullYear()}
        </p>
        <p>
          Learn more about me at
          <a
            href="https://aceto.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aceto.dev
          </a>
        </p>

        <p>
          <a href='mailto:lucas@aceto.dev'>
            Contact me
          </a>
        </p>
      </footer>

      <style jsx>{`
        footer {
          width: 100%;
          height: 70px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: space-between;
          bottom: 0;
          position: fixed;
        }

        footer p {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 1em;
        }

        footer a {
          text-decoration: underline;
          margin-left: 5px
        }
      `}</style>
    </>
  );
}

export default Footer;