import machine


class Logger:
    _levels = {
        "DEBUG": 1,
        "INFO": 2,
        "WARN": 3,
        "ERROR": 4
    }

    def __init__(self, level, file_name):
        if (level.upper() not in self._levels):
            raise ValueError('Unknown log level: ' + level)
        self.level_numeric = Logger._levels[level.upper()]
        self.file_name = file_name
        self.rtc = machine.RTC()

    def log(self, level, msg):
        if (not self._filter_on_level(level.upper())):
            return
        f = open(self.file_name, "a")
        f.write("%s %s: %s\n" % (Logger.format_time(self.rtc.datetime()), level.upper(), msg))
        f.close()

    def debug(self, msg):
        self.log("DEBUG", msg)
    
    def info(self, msg):
        self.log("INFO", msg)

    def warn(self, msg):
        self.log("WARN", msg)

    def error(self, msg):
        self.log("ERROR", msg)

    def _filter_on_level(self, level):
        return self._levels[level] >= self.level_numeric

    @staticmethod
    def format_time(timestamp):
        return '{0:04d}-{1:02d}-{2:02d} {4:02d}:{5:02d}:{6:02d}.{7:03d}'.format(*timestamp)