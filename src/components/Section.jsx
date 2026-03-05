export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="section">
      <div className="sectionHead">
        <h2 className="h2">{title}</h2>
        {subtitle ? <p className="sub">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
