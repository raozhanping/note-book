# jest

## Jest 对象
> jest 对象自动挂载到每个测试文件的上下文。 jest对象中的方法有助于创建模拟并让您控制Jest的整体行为

### 方法
- jest.clearAllTimers()
- jest.disableAutomock()
- jest.enableAutomock()
- jest.fn(implementation)
- jest.isMockFunction(fn)
- jest.genMockFromModule(moduleName)
- jest.mock(moduleName, factory, options)
- jest.unmock(moduleName)
- jest.doMock(moduleName, factory, options)
- jest.dontMock(moduleName)
- jest.clearAllMocks()
- jest.resetAllMocks()
- jest.restoreAllMocks()
- jest.resetModules()
- jest.runAllTicks()
- jest.runAllTimers()
- jest.runTimersToTime(msToRun)
- jest.runOnlyPendingTimers()
- jest.setMock(moduleName, moduleExports)
- jest.setTimeout(timeout)
- jest.useFakeTimers()
- jest.useRealTimers()
- jest.spyOn(object, methodName)

