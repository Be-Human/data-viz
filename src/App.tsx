import { createSignal, createMemo } from 'solid-js';
import { ChartRenderer } from './components/ChartRenderer';
import { parseCSV, defaultSampleData } from './utils/csvParser';
import type { ParsedData } from './utils/csvParser';
import './index.css';

type ChartType = 'bar' | 'line' | 'pie';

function App() {
  const [csvInput, setCsvInput] = createSignal<string>(defaultSampleData);
  const [chartType, setChartType] = createSignal<ChartType>('bar');

  const parsedData = createMemo<ParsedData | null>(() => {
    return parseCSV(csvInput());
  });

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  const handleCsvChange = (value: string) => {
    setCsvInput(value);
  };

  const handleUseSampleData = () => {
    setCsvInput(defaultSampleData);
  };

  const handleClearData = () => {
    setCsvInput('');
  };

  return (
    <div class="app-container">
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div>
              <h1 class="header-title">数据可视化工具</h1>
              <p class="header-subtitle">粘贴 CSV 数据，快速生成精美图表</p>
            </div>
            <div>
              <button 
                class="btn btn-secondary" 
                onClick={handleUseSampleData}
              >
                使用示例数据
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="container">
          <div class="grid-layout">
            {/* 数据输入区域 */}
            <div class="card data-input-container">
              <h2 class="section-title">
                <span class="section-icon">📊</span>
                数据输入
              </h2>
              
              <div class="data-input-wrapper">
                <textarea
                  class="textarea"
                  value={csvInput()}
                  onInput={(e) => handleCsvChange(e.currentTarget.value)}
                  placeholder="请粘贴 CSV 格式的数据...&#10;&#10;格式要求：&#10;- 第一行是列标题&#10;- 第一列是类别标签&#10;- 其余列是数值数据&#10;&#10;示例：&#10;月份,销售额,利润&#10;1月,12000,3000&#10;2月,15000,4500"
                  rows={15}
                />
                
                <div class="flex gap-2 mt-4">
                  <button 
                    class="btn btn-secondary flex-1" 
                    onClick={handleUseSampleData}
                  >
                    加载示例数据
                  </button>
                  <button 
                    class="btn btn-secondary flex-1" 
                    onClick={handleClearData}
                  >
                    清空数据
                  </button>
                </div>
                
                {parsedData() && (
                  <div class="data-stats">
                    <div class="stats-row">
                      <div class="stat-item">
                        <span class="stat-label">数据行数</span>
                        <span class="stat-value">{parsedData()!.rowCount}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">数据列数</span>
                        <span class="stat-value">{parsedData()!.columnCount}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">数据系列</span>
                        <span class="stat-value">{parsedData()!.datasets.length}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div class="example-data">
                  <div class="example-data-title">CSV 格式说明：</div>
                  <div class="example-data-content">
月份,销售额,利润,订单数
1月,12000,3000,150
2月,15000,4500,180
3月,18000,5400,220
                  </div>
                </div>
              </div>
            </div>

            {/* 图表显示区域 */}
            <div class="card chart-container">
              <h2 class="section-title">
                <span class="section-icon">📈</span>
                图表展示
              </h2>
              
              <div class="chart-controls">
                <button
                  class={`chart-type-btn ${chartType() === 'bar' ? 'active' : ''}`}
                  onClick={() => handleChartTypeChange('bar')}
                >
                  📊 柱状图
                </button>
                <button
                  class={`chart-type-btn ${chartType() === 'line' ? 'active' : ''}`}
                  onClick={() => handleChartTypeChange('line')}
                >
                  📈 折线图
                </button>
                <button
                  class={`chart-type-btn ${chartType() === 'pie' ? 'active' : ''}`}
                  onClick={() => handleChartTypeChange('pie')}
                >
                  🥧 饼图
                </button>
              </div>
              
              {parsedData() ? (
                <ChartRenderer 
                  data={parsedData()!} 
                  chartType={chartType()} 
                />
              ) : (
                <div class="no-data-message">
                  <div class="no-data-icon">📊</div>
                  <div class="no-data-text">
                    请在左侧输入 CSV 格式的数据，
                    <br />
                    或点击"使用示例数据"按钮查看演示效果。
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
