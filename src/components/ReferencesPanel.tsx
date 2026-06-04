import { arxivUrl, references, type ReferenceId } from "../content/references";
import { strings } from "../content/strings";

interface ReferencesPanelProps {
  ids: ReferenceId[];
}

/**
 * A box listing the references for the current selection, below the diagram.
 * Each entry shows the authors, the title in bold, and a link to arXiv.
 */
export function ReferencesPanel({ ids }: ReferencesPanelProps) {
  if (ids.length === 0) return null;

  return (
    <section className="references">
      <h2 className="references__title">{strings.references.title}</h2>
      <ul className="references__list">
        {ids.map((id) => {
          const ref = references[id];
          return (
            <li key={id} className="reference">
              <span className="reference__authors">{ref.authors}. </span>
              <span className="reference__paper">{ref.title}.</span>{" "}
              <a
                className="reference__link"
                href={arxivUrl(ref.arxivId)}
                target="_blank"
                rel="noreferrer"
              >
                {strings.references.arxivLabel}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
