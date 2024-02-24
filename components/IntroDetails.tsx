const IntroDetails = () => {
  return (
    <div className="w-full text-center flex flex-col flex-wrap items-center justify-center">
      <h1>Welcome to TaskMaster CLI</h1>
      <p>
        <i>
          {"// "}TaskMaster CLI: Master time, excel professionally. Free,
          open-source, indispensable for every industry pro.
        </i>
      </p>
      <span>
        LinkedIn:{" "}
        <span>
          <i>{"//"} https://www.linkedin.com/in/riccot/</i>
        </span>
      </span>
      <span>
        Github:{" "}
        <span>
          <i>{"//"} https://github.com/riccorichards</i>
        </span>
      </span>

      <span>
        Now the stage is <b>unauthorize</b>, so to interact with CLI app, you
        need to authorized,
      </span>
      <span>
        {"//"}{" "}
        <i>
          <b>to log in:</b> login -U [Username] -p [Password]
        </i>
      </span>
      <span>
        {"//"}{" "}
        <i>
          <b>to sign up:</b> sign up where username = [Username], password =
          [Password]
        </i>
      </span>
    </div>
  );
};

export default IntroDetails;
