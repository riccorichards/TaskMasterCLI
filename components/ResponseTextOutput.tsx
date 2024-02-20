const ResponseTextOutput = ({ output }: { output: string }) => {
  return (
    <div>
      <p>{`Success: ${output}`}</p>
    </div>
  );
};

export default ResponseTextOutput;
