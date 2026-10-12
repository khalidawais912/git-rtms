const Map = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54392.888661368466!2d74.28403876953124!3d31.563810199999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191b678e6a2e75%3A0xb4c984519f85bf0d!2sDirectorate%20General%20Monitoring%20%26%20Evaluation!5e0!3m2!1sen!2s!4v1726221823092!5m2!1sen!2s"
      className="col-lg-12 col-md-12 col shadow-sm mb-2"
      style={{ border: "0", borderRadius: "15px", height: "660px" }}
      allowFullScreen={true}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default Map;
