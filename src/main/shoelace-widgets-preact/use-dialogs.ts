import { createElement, render, ComponentChildren, VNode } from 'preact';
import { useState } from 'preact/hooks';

import {
  AbstractDialogsController,
  ShowDialogFunction,
  ShowToastFunction,
  StandardDialog,
  StandardToast
} from 'shoelace-widgets/internal';

// === exports =======================================================

export { useDialogs };

// === locals ========================================================

const h = createElement as (
  type: string,
  props: {} | null,
  child?: ComponentChildren
) => VNode;

// === exported hooks ================================================

function useDialogs(): {
  showDialog: ShowDialogFunction<VNode>;
  showToast: ShowToastFunction<VNode>;
  renderDialogs: () => VNode;
} {
  const [, setDummy] = useState(0);

  const forceUpdate = () =>
    setDummy((it) => (it + 1) % Number.MAX_SAFE_INTEGER);

  return useState(() => {
    const dialogCtrl = new DialogsController(forceUpdate);

    return {
      showDialog: dialogCtrl.show.bind(dialogCtrl),
      showToast: dialogCtrl.toast.bind(dialogCtrl),
      renderDialogs: dialogCtrl.render.bind(dialogCtrl)
    };
  })[0];
}

// === local classes =================================================

class DialogsController extends AbstractDialogsController<VNode> {
  static {
    // required dependencies (to avoid too much tree shaking)
    void [StandardDialog, StandardToast];
  }

  readonly #forceUpdate: () => void;

  readonly #renderers: {
    id: number;
    render: () => VNode;
  }[] = [];

  #nextRendererId = 1;

  constructor(forceUpdate: () => void) {
    let dialogResolve: ((dialogResult: unknown) => void) | null = null;

    super({
      showDialog: (type, options) => {
        const rendererId = this.#addRenderer((key) =>
          h(
            'sx-standard-dialog--internal',
            {
              key,
              config: { type, ...options },

              resolve: (result: unknown) => {
                this.#removeRenderer(rendererId);
                dialogResolve!(result);
              }
            },
            options.content
          )
        );

        return new Promise<unknown>((resolve) => {
          dialogResolve = resolve;
        }) as Promise<any>;
      },

      showToast: (type, options) => {
        let contentElement: HTMLElement | null;

        if (options.content) {
          contentElement = document.createElement('span');
          render(options.content, contentElement);
        }

        const rendererId = this.#addRenderer((key) => {
          return h('sx-standard-toast--internal', {
            key,
            config: { type, ...options },
            contentElement,
            dismissToast: () => this.#removeRenderer(rendererId)
          });
        });
      }
    });

    this.#forceUpdate = forceUpdate;
  }

  #addRenderer(render: (key: number) => VNode): number {
    const rendererId = this.#nextRendererId++;

    this.#renderers.push({
      id: rendererId,
      render: () => render(rendererId)
    });

    this.#forceUpdate();
    return rendererId;
  }

  #removeRenderer(rendererId: number) {
    const idx = this.#renderers.findIndex((it) => it.id === rendererId);
    this.#renderers.splice(idx, 1);
    this.#forceUpdate();
  }

  render() {
    return h(
      'span',
      null,
      this.#renderers.map((it) => it.render())
    );
  }
}
