const Snowflake = ({ style }) => {
    return (
      <div className="snowflake" style={style}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="white"
        >
          <path d="M50,10L45,20L35,30L45,40L50,30L55,40L65,30L55,20L50,10Z" />
        </svg>
      </div>
    );
  };
  
  export default Snowflake;  