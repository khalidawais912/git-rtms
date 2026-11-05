const PrivacyPolicyPage = () => {
  return (
    <div className="container">
      <nav
        aria-label="breadcrumb"
        className="bg-color-sea-blue rounded-top p-1 fw-5"
      >
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <a href="/" className="text-white">
              Home
            </a>
          </li>
          <li className="breadcrumb-item active text-dark" aria-current="page">
            Privacy policy
          </li>
        </ol>
      </nav>

      <div
        className="rounded-bottom overflow-hidden position-relative mb-2"
        style={{
          background: "url(/images/priavacy-policy-bg.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-blur-3 position-absolute w-100 h-100"></div>
        <div className="position-relative" style={{ zIndex: 2 }}>
          <h1 className="fs-2 fw-bold mb-1 p-5 text-white">Privacy Policy</h1>
        </div>
      </div>
      <p className="mb-3">
        The Privacy Policy has been formulated to inform site visitors how their
        personal information will be treated when they visit the website.
      </p>
      <p className="mb-3">
        Please note that Directorate General Monitoring & Evaluation (DGM&E) may
        amend this policy from time to time in accordance with the legal
        framework enacted. Site visitors are advised to check this Policy on
        regular basis.
      </p>
      <h2 className="fs-3 fw-bold">We Are Committed to Protect Your Privacy</h2>
      <p className="mb-3">
        We collect the minimum amount of information about you, commensurate
        with providing you with a satisfactory service. This policy indicates
        the types of processes that may result in data being collected about
        you. Your use of this application gives us the right to collect that
        information and we vow not misuse your personal information.
      </p>
      <h2 className="fs-3 fw-bold">Information Collected</h2>
      <p className="mb-3">
        We may collect all or any information like PHONE, CAMERA, SMS, CALENDAR,
        CONTACTS, LOCATION, INTERNETNET, SENSOR, STORAGE, MICROPHONE, together
        with data about your use of this application. Other information that may
        be needed time to time to process a request may also be collected as
        indicated on the application.
      </p>
      <h2 className="fs-3 fw-bold">Information Use</h2>
      <p className="mb-3">
        We use the information collected primarily to process the task for which
        you visited the application. Data collected in PAKISTAN is held in
        accordance with the Electronic Data Protection Act and The Prevention of
        Electronic Crimes Act. All reasonable precautions are taken to prevent
        unauthorized access to this information.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
