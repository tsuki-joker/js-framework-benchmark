import { For, query, source } from "hyplate";
import { appendChild } from "hyplate/core";
import { Source } from "hyplate/types";
import { buildData } from "./data.js";

interface Row {
    id: number;
    label: Source<string>;
}

const App = () => {
    const selectedId = source(0);
    const select = (id: number) => {
        selectedId.set(id);
    }

    const rows = source<Row[]>([]);
    const createListItem = (count = 1000) => {
        return buildData(count).map((item: Row) => {
            const { id, label } = item;
            return {
                id,
                label: source(label),
            };
        });
    };

    const run = () => {
        rows.set(createListItem());
        selectedId.set(0);
    };

    const runlots = () => {
        rows.set(createListItem(10000));
        selectedId.set(0);
    };

    const add = () => {
        rows.set(rows.val.concat(createListItem()));
    };

    const update = () => {
        for (let i = 0; i < rows.val.length; i += 10) {
            rows.val[i].label.set(`${rows.val[i].label.val} !!!`);
        }
    };

    const clear = () => {
        rows.set([]);
        selectedId.set(0);
    };

    const swapRows = () => {
        const _rows = [...rows.val];
        const r1 = _rows[1];
        const r998 = _rows[998];
        _rows[1] = r998;
        _rows[998] = r1;
        rows.set(_rows);
    };


    return (
        <div id="app" class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-12">
                        <h1>Hyplate 0.1.4 </h1>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" id="run" class="btn btn-primary btn-block" onClick={run}>
                            Create 1,000 rows
                        </button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" id="runlots" class="btn btn-primary btn-block" onClick={runlots}>
                            Create 10,000 rows
                        </button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" id="add" class="btn btn-primary btn-block" onClick={add}>
                            Append 1,000 rows
                        </button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" id="update" class="btn btn-primary btn-block" onClick={update}>
                            Update every 10th row
                        </button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" id="clear" class="btn btn-primary btn-block" onClick={clear}>
                            Clear
                        </button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" id="swaprows" class="btn btn-primary btn-block" onClick={swapRows}>
                            Swap Rows
                        </button>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                    <For of={rows}>
                        {(item) => {
                            const { id } = item;
                            const label = query(() => item.label);
                            const selected = query(() => id === selectedId.val ? 'danger': '');

                            const remove = () => {
                                const _rows = [...rows.val];
                                _rows.splice(_rows.findIndex((d) => d.id === id), 1);
                                rows.set(_rows);
                            };

                            return (
                                <tr class={selected} >
                                    <td class="col-md-1">{id}</td>
                                    <td class="col-md-4">
                                        <a onClick={() => select(id)}>
                                            {label.val}
                                        </a>
                                    </td>
                                    <td class="col-md-1">
                                        <a onClick={remove}>
                                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                        </a>
                                    </td>
                                    <td class="col-md-6"></td>
                                </tr>
                            );
                        }}
                    </For>
                </tbody>
            </table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
        </div>
    );
};

(<App />)(appendChild(document.body))