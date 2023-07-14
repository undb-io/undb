import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../../specifications/index.js'
import type { Table } from '../../../table.js'
import type { ViewVO } from '../../view.vo.js'
import type { Dashboard } from '../dashboard.vo.js'
import type { ILayoutSchema } from '../layout.type.js'
import { LayoutVO } from '../layout.vo.js'
import type { IRelayoutWidgetSchema } from '../widget.schema.js'
import type { Widget } from '../widget.vo.js'

export class WithWidgetSpecification extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: ViewVO, public readonly dashboard: Dashboard, public readonly widget: Widget) {
    super()
  }
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    this.dashboard.widgets.push(this.widget)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withWidget(this)
    return Ok(undefined)
  }
}

export class WithoutWidgetSpecification extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: ViewVO, public readonly dashboard: Dashboard, public readonly widgetId: string) {
    super()
  }
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    this.dashboard.widgets = this.dashboard.widgets.filter((w) => w.id.value !== this.widgetId)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutWidget(this)
    return Ok(undefined)
  }
}

export class WithWidgetsLayout extends CompositeSpecification<Table, ITableSpecVisitor> {
  public readonly widgetsMap: Map<string, ILayoutSchema>
  constructor(
    public readonly view: ViewVO,
    public readonly dashboard: Dashboard,
    public readonly widgets: IRelayoutWidgetSchema[],
  ) {
    super()
    this.widgetsMap = new Map(widgets.map((w) => [w.id, w.layout]))
  }
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    for (const widget of this.dashboard.widgets) {
      const layout = this.widgetsMap.get(widget.id.value)
      if (layout) {
        widget.layout = new LayoutVO(layout)
      }
    }

    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withWidgetsLayout(this)
    return Ok(undefined)
  }
}
