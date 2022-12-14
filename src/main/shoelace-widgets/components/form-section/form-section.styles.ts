import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import labelLayoutStyles from '../../styles/label-layout.styles';

export default css`
  ${componentStyles}
  ${labelLayoutStyles}

  .base {
    border: 0 solid var(--sl-color-neutral-200);
    border-top-width: 1px;
  }

  .columns {
    display: flex;
    flex-direction: row;
    border: none;
    gap: 0.5rem;
    width: 100%;
  }

  .caption {
    width: 9rem;
    font-size: calc(100% - 1px);
    font-weight: 600;
  }

  .content {
    width: 100%;
  }

  .fields {
    display: grid;
    grid-auto-rows: max-content;
  }

  .fields::slotted(*) {
  }
`;
